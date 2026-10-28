import 'dotenv/config';
import { DataSource } from 'typeorm';
import { AdminUser } from '../auth/entities/admin-user.entity';
import { ShipmentEvent } from '../shipments/entities/shipment-event.entity';
import { Shipment } from '../shipments/entities/shipment.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [AdminUser, Shipment, ShipmentEvent],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
});
