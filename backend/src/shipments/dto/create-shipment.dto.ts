import { IsOptional, IsString, IsUrl, Length, Matches } from 'class-validator';

const EGYPT_MOBILE = /^01[0125]\d{8}$/;
const PHONE_MESSAGE = 'رقم الهاتف يجب أن يكون رقم موبايل مصري صحيح';

export class CreateShipmentDto {
  @IsString() @Length(2, 80, { message: 'اسم المرسل غير صالح' })
  senderName: string;

  @Matches(EGYPT_MOBILE, { message: PHONE_MESSAGE })
  senderPhone: string;

  @IsString() @Length(5, 250, { message: 'عنوان المرسل غير صالح' })
  senderAddress: string;

  @IsString() @Length(2, 80, { message: 'اسم المستلم غير صالح' })
  receiverName: string;

  @Matches(EGYPT_MOBILE, { message: PHONE_MESSAGE })
  receiverPhone: string;

  @IsOptional()
  @IsUrl({}, { message: 'رابط الموقع غير صالح' })
  mapsUrl?: string;

  @IsString() @Length(5, 250, { message: 'عنوان المستلم غير صالح' })
  receiverAddress: string;

  @IsString() @Length(2, 100, { message: 'نوع الطرد غير صالح' })
  itemType: string;
}
