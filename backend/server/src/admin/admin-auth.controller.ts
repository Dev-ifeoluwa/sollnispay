// import { Controller } from '@nestjs/common';

// @Controller('admin-auth')
// export class AdminAuthController {}





import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminJwtGuard } from './admin-jwt.guard';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('admin')
export class AdminAuthController {
  constructor(private auth: AdminAuthService) {}

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('auth/login')
  login(@Body() body: { email: string; password: string }) {
    return this.auth.login(body.email, body.password);
  }

  @UseGuards(AdminJwtGuard)
  @Get('me')
  me(@Req() req: any) {
    return req.admin;
  }
}