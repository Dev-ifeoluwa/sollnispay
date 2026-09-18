// import { Controller, Post, Req, Res } from '@nestjs/common';
// import type { Request, Response } from 'express';

// @Controller('monnify')
// export class MonnifyController {
//   @Post('webhook')
//   handleWebhook(@Req() req: Request, @Res() res: Response) {
//     console.log(req.body);
//     res.sendStatus(200);
//   }
// }




import { Controller, Post, Req, Res, HttpStatus, BadRequestException } from '@nestjs/common';
import type { Request, Response } from 'express';
import * as crypto from 'crypto';
import { PrismaService } from 'src/prisma.service';

@Controller('webhooks/monnify')
export class MonnifyController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    // 1. Verify this actually came from Monnify
    const signature = req.headers['monnify-signature'] as string;
    const secret = process.env.MONNIFY_SECRET_KEY!;
    const rawBody = (req as any).rawBody; // requires rawBody:true in main.ts

    const expectedSignature = crypto
      .createHmac('sha512', secret)
      .update(rawBody)
      .digest('hex');

    if (signature !== expectedSignature) {
      throw new BadRequestException('Invalid signature');
    }

    const event = req.body;

    // 2. Only act on successful transactions
    if (event.eventType !== 'SUCCESSFUL_TRANSACTION') {
      return res.status(HttpStatus.OK).send(); // acknowledge, ignore
    }

    const accountRef = event.eventData.product.reference;
    const amountPaid = event.eventData.amountPaid;
    const paymentReference = event.eventData.paymentReference;

    // 3. Idempotency check — don't credit the same payment twice
    const existing = await this.prisma.transaction.findUnique({
      where: { idempotencyKey: paymentReference },
    });
    if (existing) {
      return res.status(HttpStatus.OK).send();
    }

    // 4. Find the user this reserved account belongs to
    const user = await this.prisma.totalUser.findFirst({
      where: { monnifyAccountRef: accountRef },
    });
    if (!user) {
      throw new BadRequestException('No user matches this account reference');
    }

    // 5. Credit balance + log transaction, atomically
    await this.prisma.$transaction([
      this.prisma.totalUser.update({
        where: { id: user.id },
        data: { balance: { increment: amountPaid } },
      }),
      this.prisma.transaction.create({
        data: {
          amount: amountPaid,
          type: 'WALLET_FUNDING',
          provider: 'INTERNAL',
          providerRef: paymentReference,
          idempotencyKey: paymentReference,
          status: 'SUCCESS',
          description: 'Wallet funding via Monnify reserved account',
          userId: user.id,
        },
      }),
    ]);

    return res.status(HttpStatus.OK).send();
  }
}