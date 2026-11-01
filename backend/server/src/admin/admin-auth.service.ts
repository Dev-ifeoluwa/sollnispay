import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'; // same library you used in create-admin.ts
import { PrismaService } from 'src/prisma.service';
// import { PrismaService } from '../prisma/prisma.service'; // adjust to your path

@Injectable()
export class AdminAuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async login(email: string, password: string) {
    // one message for every failure, so nobody can tell which part was wrong
    const fail = () => new UnauthorizedException('Invalid email or password');
    if (!email || !password) throw fail();

    const admin = await this.prisma.admin.findFirst({
      where: { email: { equals: email.trim(), mode: 'insensitive' } },
    });
    if (!admin || !admin.isActive) throw fail();
    if (!(await bcrypt.compare(password, admin.password))) throw fail();

    const accessToken = await this.jwt.signAsync({ sub: admin.id, type: 'admin' });
    return { accessToken };
  }
}