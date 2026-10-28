import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ShipmentStatus } from '../shipment-status.enum';

export class UpdateStatusDto {
  @IsEnum(ShipmentStatus, { message: 'حالة الشحنة غير صالحة' })
  status: ShipmentStatus;

  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'الملاحظة طويلة جداً' })
  note?: string;
}
