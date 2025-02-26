-- CreateTable
CREATE TABLE `Client` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyName` VARCHAR(191) NULL,
    `resortName` VARCHAR(191) NOT NULL,
    `gstTinNo` VARCHAR(191) NULL,
    `itContact` VARCHAR(191) NULL,
    `designation` VARCHAR(191) NULL,
    `resortContact` VARCHAR(191) NULL,
    `mobileNo` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `atoll` VARCHAR(191) NULL,
    `maleOfficeAddress` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Client_resortName_key`(`resortName`),
    UNIQUE INDEX `Client_gstTinNo_key`(`gstTinNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Quote` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `resortName` VARCHAR(191) NOT NULL,
    `quotedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `quoteCategory` ENUM('PMS', 'POS', 'BACK_OFFICE', 'HARDWARE', 'LICENSE', 'OTHERS') NOT NULL,
    `nextFollowUp` DATETIME(3) NOT NULL DEFAULT DATE_ADD(NOW(), INTERVAL 5 DAY),
    `status` ENUM('QUOTED', 'FOLLOW_UP', 'CONFIRMED', 'CANCELLED', 'BUDGETORY', 'UNDECIDED') NOT NULL DEFAULT 'QUOTED',
    `remarks` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuoteItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quoteId` INTEGER NOT NULL,
    `itemId` INTEGER NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,

    UNIQUE INDEX `QuoteItem_quoteId_itemId_key`(`quoteId`, `itemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Quote` ADD CONSTRAINT `Quote_resortName_fkey` FOREIGN KEY (`resortName`) REFERENCES `Client`(`resortName`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuoteItem` ADD CONSTRAINT `QuoteItem_quoteId_fkey` FOREIGN KEY (`quoteId`) REFERENCES `Quote`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuoteItem` ADD CONSTRAINT `QuoteItem_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
