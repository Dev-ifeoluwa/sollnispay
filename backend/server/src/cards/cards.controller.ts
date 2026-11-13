// import { BadRequestException, Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
// import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
// import type { Request } from 'express';
// import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
// import { CardsService } from './cards.service';
// import { EnrollCardholderDto } from './dto/enroll-cardholder.dto';

// @Controller('cards')
// @UseGuards(JwtAuthGuard)
// export class CardsController {
//   constructor(private cards: CardsService) {}

//   private userId(req: Request): number {
//     const id = (req.user as any)?.userId;
//     if (!id) throw new BadRequestException('No user found');
//     return id;
//   }

//   @Get('cardholder')
//   getMine(@Req() req: Request) {
//     return this.cards.getMine(this.userId(req));
//   }

//   // Each attempt can trigger a paid identity check, so keep this tight
//   @Post('cardholder')
//   @HttpCode(200)
//   @UseGuards(ThrottlerGuard)
//   @Throttle({ default: { limit: 3, ttl: 60_000 } })
//   enroll(@Req() req: Request, @Body() dto: EnrollCardholderDto) {
//     return this.cards.enroll(this.userId(req), dto);
//   }
// }






import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { CardsService } from './cards.service';
import { EnrollCardholderDto } from './dto/enroll-cardholder.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { FundCardDto } from './dto/fund-card.dto';

@Controller('cards')
@UseGuards(JwtAuthGuard)
export class CardsController {
  constructor(private cards: CardsService) {}

  private userId(req: Request): number {
    const id = (req.user as any)?.userId;
    if (!id) throw new BadRequestException('No user found');
    return id;
  }

  @Get('cardholder')
  getMine(@Req() req: Request) {
    return this.cards.getMine(this.userId(req));
  }

  // Each attempt can trigger a paid identity check, so keep this tight
  @Post('cardholder')
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  enroll(@Req() req: Request, @Body() dto: EnrollCardholderDto) {
    return this.cards.enroll(this.userId(req), dto);
  }

  @Get()
  list(@Req() req: Request) {
    return this.cards.list(this.userId(req));
  }

  @Post()
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  create(@Req() req: Request, @Body() dto: CreateCardDto) {
    return this.cards.createCard(this.userId(req), dto);
  }

    @Get('quote')
  quote(@Query('usd') usd: string) {
    return this.cards.quote(Number(usd));
  }

  @Post(':id/fund')
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  fund(@Req() req: Request, @Param('id', ParseIntPipe) id: number, @Body() dto: FundCardDto) {
    return this.cards.fund(this.userId(req), id, dto);
  }


  
}