// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class AuditService {}



import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

type AuditEntry = {
  adminId: number;
  action: string;
  targetType?: string;
  targetId?: string | number;
  before?: unknown;
  after?: unknown;
  reason?: string;
  ip?: string;
};

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  log(entry: AuditEntry) {
    return this.prisma.auditLog.create({
      data: {
        adminId: entry.adminId,
        action: entry.action,
        targetType: entry.targetType,
        targetId: entry.targetId != null ? String(entry.targetId) : undefined,
        before: entry.before as Prisma.InputJsonValue | undefined,
        after: entry.after as Prisma.InputJsonValue | undefined,
        reason: entry.reason,
        ip: entry.ip,
      },
    });
  }
}
