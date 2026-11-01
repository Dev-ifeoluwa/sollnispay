// import { Controller } from '@nestjs/common';

// @Controller('admin-transactions')
// export class AdminTransactionsController {}




import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminJwtGuard } from './admin-jwt.guard';
import { AdminTransactionsService } from './admin-transactions.service';

@UseGuards(AdminJwtGuard)
@Controller('admin/transactions')
export class AdminTransactionsController {
  constructor(private service: AdminTransactionsService) {}

  @Get()
  list(@Query() query: Record<string, string>) {
    return this.service.list(query);
  }
}