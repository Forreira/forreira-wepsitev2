import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ListShipmentsQuery } from './dto/list-shipments.query';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ShipmentsService } from './shipments.service';

@Controller('admin/shipments')
@UseGuards(JwtAuthGuard)
export class AdminShipmentsController {
  constructor(private readonly shipments: ShipmentsService) {}

  @Get()
  list(@Query() query: ListShipmentsQuery) {
    return this.shipments.list(query);
  }

  @Patch(':id/status')
  updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateStatusDto) {
    return this.shipments.updateStatus(id, dto);
  }
}
