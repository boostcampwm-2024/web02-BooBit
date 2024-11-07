-- CreateTable
CREATE TABLE "Asset" (
    "asset_id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "currency_code" TEXT NOT NULL,
    "available_balance" DECIMAL NOT NULL,
    "locked_balance" DECIMAL NOT NULL,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DepositWithdrawal" (
    "tx_id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "currency_code" TEXT NOT NULL,
    "tx_type" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Asset_user_id_currency_code_key" ON "Asset"("user_id", "currency_code");

-- CreateIndex
CREATE INDEX "DepositWithdrawal_user_id_idx" ON "DepositWithdrawal"("user_id");
