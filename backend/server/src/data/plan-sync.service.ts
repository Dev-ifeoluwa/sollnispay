// import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
// import { Cron } from '@nestjs/schedule';
// import { PrismaService } from 'src/prisma.service';
// import { SabussService } from 'src/sabuss/sabuss.service';
// import { parsePlan, sellingPrice } from './pricing';

// /** Keeps the Service table in step with Sabuss's plan list and prices. */
// @Injectable()
// export class PlanSyncService implements OnApplicationBootstrap {
//   private readonly logger = new Logger(PlanSyncService.name);

//   constructor(private prisma: PrismaService, private sabuss: SabussService) {}

//   // first run: fill the table if there are no Sabuss plans yet
//   async onApplicationBootstrap() {
//     try {
//       const count = await this.prisma.service.count({ where: { provider: 'SABUSS' } });
//       if (count === 0) await this.sync();
//     } catch (err: any) {
//       this.logger.warn(`Initial plan sync skipped: ${err?.message}`);
//     }
//   }

//   @Cron('0 3 * * *') // every day at 3am
//   async daily() {
//     try {
//       await this.sync();
//     } catch (err: any) {
//       this.logger.error(`Plan sync failed: ${err?.message}`);
//     }
//   }

//   async sync() {
//     const plans = await this.sabuss.getPlans('data');
//     if (plans.length === 0) {
//       this.logger.warn('Sabuss returned no plans, leaving the table unchanged');
//       return { synced: 0, skipped: 0 };
//     }

//     let synced = 0;
//     let skipped = 0;
//     for (const p of plans) {
//       const parsed = parsePlan(p.name);
//       if (!parsed || !(p.amount > 0)) {
//         skipped++; // Smile / Freedom or a bad price
//         continue;
//       }
//       await this.prisma.service.upsert({
//         where: { provider_code: { provider: 'SABUSS', code: p.planId } },
//         create: {
//           name: p.name,
//           type: `${parsed.network}_DATA`,
//           code: p.planId,
//           provider: 'SABUSS',
//           network: parsed.network,
//           validity: parsed.validity,
//           costPrice: p.amount,
//           price: sellingPrice(p.amount),
//         },
//         // isActive is left alone on purpose, so plans you switched off stay off
//         update: {
//           name: p.name,
//           network: parsed.network,
//           validity: parsed.validity,
//           costPrice: p.amount,
//           price: sellingPrice(p.amount),
//         },
//       });
//       synced++;
//     }
//     this.logger.log(`Sabuss plan sync: ${synced} synced, ${skipped} skipped`);
//     return { synced, skipped };
//   }
// }






import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma.service';
// import { YangaplugService } from 'src/yangaplug/yangaplug.service';
import { parseYangaplugPlan, sellingPrice } from './pricing';
import { YangaplugService } from 'src/yangaplug/yangaplug.service';

/** Keeps the Service table in step with Yangaplug's data plans and prices. */
@Injectable()
export class PlanSyncService implements OnApplicationBootstrap {
  private readonly logger = new Logger(PlanSyncService.name);

  constructor(private prisma: PrismaService, private yangaplug: YangaplugService) {}

  // first run: fill the table if there are no Yangaplug plans yet
  async onApplicationBootstrap() {
    try {
      const count = await this.prisma.service.count({ where: { provider: 'YANGAPLUG' } });
      if (count === 0) await this.sync();
    } catch (err: any) {
      this.logger.warn(`Initial plan sync skipped: ${err?.message}`);
    }
  }

  @Cron('0 3 * * *') // every day at 3am
  async daily() {
    try {
      await this.sync();
    } catch (err: any) {
      this.logger.error(`Plan sync failed: ${err?.message}`);
    }
  }

  async sync() {
    const plans = await this.yangaplug.getPlans(); // every active data network
    if (plans.length === 0) {
      this.logger.warn('Yangaplug returned no plans, leaving the table unchanged');
      return { synced: 0, skipped: 0 };
    }

    let synced = 0;
    let skipped = 0;
    const unknownBillers = new Set<string>();

    for (const p of plans) {
      const parsed = parseYangaplugPlan(p.billerCode, p.name);
      if (!parsed || !(p.amount > 0)) {
        if (!parsed) unknownBillers.add(p.billerCode);
        skipped++; // unsupported network or a bad price
        continue;
      }
      await this.prisma.service.upsert({
        where: { provider_code: { provider: 'YANGAPLUG', code: p.planId } },
        create: {
          name: p.name,
          type: `${parsed.network}_DATA`,
          code: p.planId,
          provider: 'YANGAPLUG',
          network: parsed.network,
          validity: parsed.validity,
          costPrice: p.amount,
          price: sellingPrice(p.amount),
        },
        // isActive is left alone on purpose, so plans you switched off stay off
        update: {
          name: p.name,
          network: parsed.network,
          validity: parsed.validity,
          costPrice: p.amount,
          price: sellingPrice(p.amount),
        },
      });
      synced++;
    }

    if (unknownBillers.size > 0) {
      this.logger.warn(`Skipped plans from unrecognised billers: ${[...unknownBillers].join(', ')}`);
    }
    this.logger.log(`Yangaplug plan sync: ${synced} synced, ${skipped} skipped`);
    return { synced, skipped };
  }
}