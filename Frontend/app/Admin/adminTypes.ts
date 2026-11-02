export type TxUser = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
};

export type Tx = {
    id: number;
    amount: number;
    type: string;
    provider: string | null;
    providerRef: string | null;
    status: string;
    description: string | null;
    itemsPurchased: string | null;
    createdAt: string;
    approvedById: number | null;
    userId: number;
    user: TxUser | null;
};

export type TxList = {
    items: Tx[];
    total: number;
    page: number;
    limit: number;
    pages: number;
};

// Response of GET /admin/stats
export type Stats = {
    generatedAt: string;
    users: { total: number; new7d: number };
    walletBalances: number;
    today: {
        funding: number;
        fundingCount: number;
        sales: number;
        salesCount: number;
        total: number;
        success: number;
        failed: number;
        pending: number;
    };
    yesterday: { funding: number; sales: number };
    attention: { stalePending: number; failed24h: number };
    series: { day: string; funding: number; sales: number; count: number }[];
    statusBreakdown: Record<string, number>;
    byType: { type: string; count: number; volume: number }[];
};