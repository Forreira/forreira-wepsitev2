import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminShipmentsController } from './admin-shipments.controller';
import { ShipmentEvent } from './entities/shipment-event.entity';
import { Shipment } from './entities/shipment.entity';
import { ShipmentsController } from './shipments.controller';
import { ShipmentsService } from './shipments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Shipment, ShipmentEvent])],
  controllers: [ShipmentsController, AdminShipmentsController],
  providers: [ShipmentsService],
})
export class ShipmentsModule {}
