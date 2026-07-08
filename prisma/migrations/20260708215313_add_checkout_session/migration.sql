/*
  Warnings:

  - You are about to drop the column `paymentIntentId` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[checkoutSessionId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "payments_paymentIntentId_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "paymentIntentId",
ADD COLUMN     "checkoutSessionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "payments_checkoutSessionId_key" ON "payments"("checkoutSessionId");
