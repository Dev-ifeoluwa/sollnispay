/*
  Warnings:

  - You are about to drop the column `accountNumber` on the `TotalUser` table. All the data in the column will be lost.
  - You are about to drop the column `monnifyReservedId` on the `TotalUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TotalUser" DROP COLUMN "accountNumber",
DROP COLUMN "monnifyReservedId";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "approvedById" INTEGER,
ADD COLUMN     "proofUrl" TEXT;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
