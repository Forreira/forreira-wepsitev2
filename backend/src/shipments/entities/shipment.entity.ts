import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ShipmentStatus } from '../shipment-status.enum';
import { ShipmentEvent } from './shipment-event.entity';

@Entity('shipments')
@Index(['status', 'createdAt'])
export class Shipment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 11, unique: true })
  trackingCode: string;

  @Column({ type: 'varchar', length: 80 })
  senderName: string;

  @Column({ type: 'varchar', length: 11 })
  senderPhone: string;

  @Column({ type: 'varchar', length: 250 })
  senderAddress: string;

  @Column({ type: 'varchar', length: 80 })
  receiverName: string;

  @Column({ type: 'varchar', length: 11 })
  receiverPhone: string;

  @Column({ type: 'varchar', length: 250 })
  receiverAddress: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  mapsUrl: string | null;

  @Column({ type: 'varchar', length: 100 })
  itemType: string;

  @Column({ type: 'enum', enum: ShipmentStatus, default: ShipmentStatus.RECEIVED })
  status: ShipmentStatus;

  @OneToMany(() => ShipmentEvent, (event) => event.shipment, { cascade: ['insert'] })
  events: ShipmentEvent[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
