import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MonnifyService {
  private base = process.env.MONNIFY_BASE_URL || 'https://sandbox.monnify.com';
  private apiKey = process.env.MONNIFY_API_KEY!;
  private secretKey = process.env.MONNIFY_SECRET_KEY!;
  private contractCode = process.env.MONNIFY_CONTRACT_CODE!;

  constructor(private http: HttpService, private prisma: PrismaService) {}

  // Step 1: exchange API key/secret for a temporary access token
  private async getAccessToken(): Promise<string> {
    const credentials = Buffer.from(`${this.apiKey}:${this.secretKey}`).toString('base64');

    const res = await firstValueFrom(
      this.http.post(
        `${this.base}/api/v1/auth/login`,
        {},
        { headers: { Authorization: `Basic ${credentials}` } },
      ),
    );

    return res.data.responseBody.accessToken;
  }

  // Step 2: create a reserved account for a specific user, and save it on their record
  async createReservedAccountForUser(userId: number) {
    const user = await this.prisma.totalUser.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const accountReference = `sollnis-user-${user.id}`;
    const token = await this.getAccessToken();

    const res = await firstValueFrom(
      this.http.post(
        `${this.base}/api/v1/bank-transfer/reserved-accounts`,
        {
          accountReference,
          accountName: `${user.firstName} ${user.lastName}`,
          currencyCode: 'NGN',
          contractCode: this.contractCode,
          customerEmail: user.email,
          customerName: `${user.firstName} ${user.lastName}`,
          // bvn: user.bvn,  // add once you collect BVN at signup — required for live mode
        },
        { headers: { Authorization: `Bearer ${token}` } },
      ),
    );

    const body = res.data.responseBody;

    // Save the Monnify details onto this user's record
    await this.prisma.totalUser.update({
      where: { id: user.id },
      data: {
        monnifyAccountRef: body.accountReference,
        monnifyAccountNumber: body.accountNumber,
        monnifyAccountStatus: body.status,
      },
    });

    return body;
  }
}
