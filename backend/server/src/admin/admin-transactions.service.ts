// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class AdminTransactionsService {}




import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Provider, TransactionStatus, TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma.service';

type Query = Record<string, string | undefined>;

@Injectable()
export class AdminTransactionsService {
  constructor(private prisma: PrismaService) {}

  async list(q: Query) {
    const page = Math.max(1, parseInt(q.page ?? '1', 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(q.limit ?? '20', 10) || 20));

    const where: Prisma.TransactionWhereInput = {};

    if (q.status) {
      if (!Object.values(TransactionStatus).includes(q.status as TransactionStatus)) {
        throw new BadRequestException('Invalid status');
      }
      where.status = q.status as TransactionStatus;
    }
    if (q.type) {
      if (!Object.values(TransactionType).includes(q.type as TransactionType)) {
        throw new BadRequestException('Invalid type');
      }
      where.type = q.type as TransactionType;
    }
    if (q.provider) {
      if (!Object.values(Provider).includes(q.provider as Provider)) {
        throw new BadRequestException('Invalid provider');
      }
      where.provider = q.provider as Provider;
    }
    if (q.userId) {
      const id = parseInt(q.userId, 10);
      if (Number.isNaN(id)) throw new BadRequestException('Invalid userId');
      where.userId = id;
    }

    // dates: "2026-11-01" or a full ISO timestamp; a date-only "to" includes that whole day
    const createdAt: Prisma.DateTimeFilter = {};
    if (q.from) {
      const d = new Date(q.from);
      if (isNaN(d.getTime())) throw new BadRequestException('Invalid from date');
      createdAt.gte = d;
    }
    if (q.to) {
      const d = new Date(q.to.length === 10 ? `${q.to}T23:59:59.999Z` : q.to);
      if (isNaN(d.getTime())) throw new BadRequestException('Invalid to date');
      createdAt.lte = d;
    }
    if (createdAt.gte || createdAt.lte) where.createdAt = createdAt;

    const search = q.search?.trim();
    if (search) {
      const or: Prisma.TransactionWhereInput[] = [
        { providerRef: { contains: search, mode: 'insensitive' } },
        { idempotencyKey: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { user: { phoneNumber: { contains: search } } },
      ];
      const asId = parseInt(search, 10);
      if (!Number.isNaN(asId) && String(asId) === search) or.push({ id: asId });
      where.OR = or;
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.transaction.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          amount: true,
          type: true,
          provider: true,
          providerRef: true,
          status: true,
          description: true,
          itemsPurchased: true,
          createdAt: true,
          approvedById: true,
          userId: true,
          user: {
            select: { id: true, email: true, firstName: true, lastName: true, phoneNumber: true },
          },
        },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }
}