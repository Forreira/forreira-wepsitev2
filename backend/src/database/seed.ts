import * as bcrypt from 'bcryptjs';
import { AdminUser } from '../auth/entities/admin-user.entity';
import { ShipmentEvent } from '../shipments/entities/shipment-event.entity';
import { Shipment } from '../shipments/entities/shipment.entity';
import { ShipmentStatus } from '../shipments/shipment-status.enum';
import { AppDataSource } from './data-source';

const DEMO_CODE = 'FOR12345678';

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set');

  const repo = AppDataSource.getRepository(AdminUser);
  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await repo.findOneBy({ email });
  await repo.save(existing ? { ...existing, passwordHash } : repo.create({ email, passwordHash }));
  console.log(`Admin user ready: ${email}`);
}

async function seedDemoShipment() {
  if (process.env.SEED_DEMO === 'false') return;
  const repo = AppDataSource.getRepository(Shipment);
  if (await repo.existsBy({ trackingCode: DEMO_CODE })) return;

  await repo.save(
    repo.create({
      trackingCode: DEMO_CODE,
      senderName: 'متجر تجريبي',
      senderPhone: '01000000000',
      senderAddress: 'القاهرة، مدينة نصر',
      receiverName: 'عميل تجريبي',
      receiverPhone: '01100000000',
      receiverAddress: 'الجيزة، الدقي',
      mapsUrl: null,
      itemType: 'طرد صغير',
      status: ShipmentStatus.IN_TRANSIT,
      events: [
        { status: ShipmentStatus.RECEIVED, note: 'تم استلام طلب الشحن' },
        { status: ShipmentStatus.PICKED_UP, note: null },
        { status: ShipmentStatus.IN_TRANSIT, note: 'الكابتن في الطريق' },
      ] as ShipmentEvent[],
    }),
  );
  console.log(`Demo shipment ready: ${DEMO_CODE}`);
}

async function main() {
  await AppDataSource.initialize();
  await seedAdmin();
  await seedDemoShipment();
  await AppDataSource.destroy();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
