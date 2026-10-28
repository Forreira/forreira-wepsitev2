import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { ShipmentsService } from './shipments.service';

@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly shipments: ShipmentsService) {}

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  create(@Body() dto: CreateShipmentDto) {
    return this.shipments.create(dto);
  }

  @Get('track/:code')
  track(@Param('code') code: string) {
    return this.shipments.findPublicByCode(code);
  }
}
