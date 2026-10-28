import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomInt } from 'crypto';
import { DataSource, Repository } from 'typeorm';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { ListShipmentsQuery } from './dto/list-shipments.query';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ShipmentEvent } from './entities/shipment-event.entity';
import { Shipment } from './entities/shipment.entity';
import { ShipmentStatus } from './shipment-status.enum';

const TRACKING_CODE_PATTERN = /^FOR\d{8}$/;
const MAX_CODE_ATTEMPTS = 5;

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectRepository(Shipment) private readonly shipments: Repository<Shipment>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateShipmentDto) {
    const trackingCode = await this.generateTrackingCode();
    const shipment = this.shipments.create({
      ...dto,
      mapsUrl: dto.mapsUrl ?? null,
      trackingCode,
      events: [{ status: ShipmentStatus.RECEIVED, note: 'تم استلام طلب الشحن' }],
    });
    await this.shipments.save(shipment);
    return { trackingCode };
  }

  /** Public lookup: returns status and timeline only, never personal data. */
  async findPublicByCode(rawCode: string) {
    const code = rawCode.trim().toUpperCase();
    const shipment = TRACKING_CODE_PATTERN.test(code)
      ? await this.shipments.findOne({
          where: { trackingCode: code },
          relations: { events: true },
          order: { events: { createdAt: 'DESC' } },
        })
      : null;

    if (!shipment) throw new NotFoundException('لم يتم العثور على شحنة بهذا الرقم');

    return {
      trackingCode: shipment.trackingCode,
      status: shipment.status,
      createdAt: shipment.createdAt,
      updatedAt: shipment.updatedAt,
      events: shipment.events.map(({ status, note, createdAt }) => ({ status, note, createdAt })),
    };
  }

  async list({ status, page, limit }: ListShipmentsQuery) {
    const [items, total] = await this.shipments.findAndCount({
      where: status ? { status } : {},
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit };
  }

  async updateStatus(id: string, { status, note }: UpdateStatusDto) {
    return this.dataSource.transaction(async (manager) => {
      const shipment = await manager.findOneBy(Shipment, { id });
      if (!shipment) throw new NotFoundException('الشحنة غير موجودة');

      shipment.status = status;
      await manager.save(shipment);
      await manager.save(manager.create(ShipmentEvent, { shipmentId: id, status, note: note ?? null }));
      return shipment;
    });
  }

  private async generateTrackingCode(): Promise<string> {
    for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
      const code = `FOR${randomInt(10_000_000, 100_000_000)}`;
      if (!(await this.shipments.existsBy({ trackingCode: code }))) return code;
    }
    throw new InternalServerErrorException('تعذر إنشاء رقم الشحنة، حاول مرة أخرى');
  }
}
