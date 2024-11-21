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

-- CreateTable
CREATE TABLE `order_history` (
    `history_id` BIGINT NOT NULL AUTO_INCREMENT,
    `order_type` VARCHAR(10) NOT NULL,
    `user_id` BIGINT NOT NULL,
    `coin_code` VARCHAR(20) NOT NULL,
    `price` DECIMAL(24, 8) NOT NULL,
    `quantity` DECIMAL(24, 8) NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `order_history_user_id_idx`(`user_id`),
    PRIMARY KEY (`history_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
