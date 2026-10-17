import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma.service';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return secret;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // cookie (not used across vercel/render, but harmless)
        (req) => req?.cookies?.jid || null,
        // Bearer header: what your frontend actually sends
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(),
    });
  }

  async validate(payload: any) {
    // reject tokens for users who were deleted (or no longer exist)
    const user = await this.prisma.totalUser.findUnique({
      where: { id: payload.sub },
      select: { id: true, deletedAt: true },
    });
    if (!user || user.deletedAt) throw new UnauthorizedException();

    return { userId: payload.sub, email: payload.email };
  }
}