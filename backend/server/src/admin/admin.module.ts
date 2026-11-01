// import { Module } from '@nestjs/common';
// import { AdminAuthService } from './admin-auth.service';
// import { AdminAuthController } from './admin-auth.controller';

// @Module({
//   providers: [AdminAuthService],
//   controllers: [AdminAuthController]
// })
// export class AdminModule {}





import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { AdminJwtGuard } from './admin-jwt.guard';
import { PrismaService } from 'src/prisma.service';
import { ThrottlerModule } from '@nestjs/throttler';
// import { PrismaService } from '../prisma/prisma.service'; // adjust to your path

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    JwtModule.registerAsync({
      useFactory: () => {
        if (!process.env.ADMIN_JWT_SECRET) throw new Error('ADMIN_JWT_SECRET is not set');
        return { secret: process.env.ADMIN_JWT_SECRET, signOptions: { expiresIn: '1h' } };
      },
    }),
  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService, AdminJwtGuard, PrismaService],
  exports: [AdminJwtGuard, JwtModule],
})
export class AdminModule {}