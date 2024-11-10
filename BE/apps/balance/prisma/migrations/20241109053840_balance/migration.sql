-- CreateTable
CREATE TABLE `currency` (
    `currency_code` VARCHAR(20) NOT NULL,
    `name` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`currency_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asset` (
    `asset_id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `currency_code` VARCHAR(20) NOT NULL,
    `available_balance` DECIMAL(24, 8) NOT NULL,
    `locked_balance` DECIMAL(24, 8) NOT NULL,
    `updated_at` TIMESTAMP(3) NOT NULL,

    UNIQUE INDEX `asset_user_id_currency_code_key`(`user_id`, `currency_code`),
    PRIMARY KEY (`asset_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `deposit_withdrawal` (
    `tx_id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `currency_code` VARCHAR(20) NOT NULL,
    `tx_type` VARCHAR(20) NOT NULL,
    `amount` DECIMAL(24, 8) NOT NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `deposit_withdrawal_user_id_idx`(`user_id`),
    PRIMARY KEY (`tx_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
