import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminJwtGuard } from './admin-jwt.guard';
import { AdminStatsService } from './admin-stats.service';

@UseGuards(AdminJwtGuard)
@Controller('admin/stats')
export class AdminStatsController {
  constructor(private service: AdminStatsService) {}

  @Get()
  overview() {
    return this.service.overview();
  }
}