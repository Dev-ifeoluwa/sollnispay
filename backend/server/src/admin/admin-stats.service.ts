import { Injectable } from '@nestjs/common';
import { TransactionStatus, TransactionType } from '@prisma/client';
import { PrismaService } from '../prisma.service';

const DAY = 24 * 60 * 60 * 1000;
// Lagos is UTC+1 all year (no daylight saving), so "today" starts at 23:00 UTC the day before
const LAGOS_OFFSET = 60 * 60 * 1000;

// What counts as a sale. Keep in sync with the SQL below and SALE_TYPES in the frontend.
const SALE_TYPES: TransactionType[] = [
  TransactionType.AIRTIME,
  TransactionType.DATA,
  TransactionType.TV_SUBSCRIPTION,
  TransactionType.ELECTRICITY,
  TransactionType.EDUCATION,
  TransactionType.SPORT,
];

@Injectable()
export class AdminStatsService {
  constructor(private prisma: PrismaService) {}

  async overview() {
    const now = Date.now();
    const startToday = new Date(Math.floor((now + LAGOS_OFFSET) / DAY) * DAY - LAGOS_OFFSET);
    const startYesterday = new Date(startToday.getTime() - DAY);
    const start7 = new Date(startToday.getTime() - 6 * DAY);
    const start30 = new Date(startToday.getTime() - 29 * DAY);
    const staleBefore = new Date(now - 15 * 60 * 1000);
    const last24h = new Date(now - DAY);

    const sumOf = (types: TransactionType[], from: Date, to?: Date) =>
      this.prisma.transaction.aggregate({
        where: {
          status: TransactionStatus.SUCCESS,
          type: { in: types },
          createdAt: { gte: from, ...(to ? { lt: to } : {}) },
        },
        _sum: { amount: true },
        _count: { _all: true },
      });

    const [
      usersTotal,
      usersNew,
      balances,
      fundToday,
      fundYesterday,
      salesToday,
      salesYesterday,
      todayByStatus,
      status30,
      byType30,
      stalePending,
      failed24h,
      seriesRows,
    ] = await Promise.all([
      this.prisma.totalUser.count({ where: { deletedAt: null } }),
      this.prisma.totalUser.count({ where: { deletedAt: null, createdAt: { gte: start7 } } }),
      this.prisma.totalUser.aggregate({ where: { deletedAt: null }, _sum: { balance: true } }),
      sumOf([TransactionType.WALLET_FUNDING], startToday),
      sumOf([TransactionType.WALLET_FUNDING], startYesterday, startToday),
      sumOf(SALE_TYPES, startToday),
      sumOf(SALE_TYPES, startYesterday, startToday),
      this.prisma.transaction.groupBy({
        by: ['status'],
        where: { createdAt: { gte: startToday } },
        _count: { _all: true },
      }),
      this.prisma.transaction.groupBy({
        by: ['status'],
        where: { createdAt: { gte: start30 } },
        _count: { _all: true },
      }),
      this.prisma.transaction.groupBy({
        by: ['type'],
        where: { status: TransactionStatus.SUCCESS, createdAt: { gte: start30 } },
        _sum: { amount: true },
        _count: { _all: true },
      }),
      this.prisma.transaction.count({
        where: { status: TransactionStatus.PENDING, createdAt: { lt: staleBefore } },
      }),
      this.prisma.transaction.count({
        where: { status: TransactionStatus.FAILED, createdAt: { gte: last24h } },
      }),
      // per-day totals in Lagos time ("createdAt" is stored as UTC)
      this.prisma.$queryRaw<{ day: string; funding: number; sales: number; count: number }[]>`
        SELECT to_char(("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE 'Africa/Lagos', 'YYYY-MM-DD') AS day,
               COALESCE(SUM("amount") FILTER (
                 WHERE "status" = 'SUCCESS' AND "type" = 'WALLET_FUNDING'), 0)::float AS funding,
               COALESCE(SUM("amount") FILTER (
                 WHERE "status" = 'SUCCESS'
                   AND "type" IN ('AIRTIME','DATA','TV_SUBSCRIPTION','ELECTRICITY','EDUCATION','SPORT')), 0)::float AS sales,
               COUNT(*)::int AS count
        FROM "Transaction"
        WHERE "createdAt" >= ${start7}
        GROUP BY 1
        ORDER BY 1`,
    ]);

    const counts = (rows: { status: TransactionStatus; _count: { _all: number } }[]) =>
      Object.fromEntries(rows.map((r) => [r.status, r._count._all])) as Record<string, number>;

    const today = counts(todayByStatus);
    const todayTotal = Object.values(today).reduce((a, b) => a + b, 0);

    // one entry per day for the last 7 days, including days with no transactions
    const byDay = new Map(seriesRows.map((r) => [r.day, r]));
    const series = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start7.getTime() + i * DAY + LAGOS_OFFSET).toISOString().slice(0, 10);
      const r = byDay.get(day);
      return { day, funding: r?.funding ?? 0, sales: r?.sales ?? 0, count: r?.count ?? 0 };
    });

    return {
      generatedAt: new Date(now).toISOString(),
      users: { total: usersTotal, new7d: usersNew },
      walletBalances: balances._sum.balance ?? 0,
      today: {
        funding: fundToday._sum.amount ?? 0,
        fundingCount: fundToday._count._all,
        sales: salesToday._sum.amount ?? 0,
        salesCount: salesToday._count._all,
        total: todayTotal,
        success: today.SUCCESS ?? 0,
        failed: today.FAILED ?? 0,
        pending: today.PENDING ?? 0,
      },
      yesterday: {
        funding: fundYesterday._sum.amount ?? 0,
        sales: salesYesterday._sum.amount ?? 0,
      },
      attention: { stalePending, failed24h },
      series,
      statusBreakdown: counts(status30),
      byType: byType30.map((r) => ({
        type: r.type,
        count: r._count._all,
        volume: r._sum.amount ?? 0,
      })),
    };
  }
}