-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL DEFAULT 'Untitled Product',
    `isNew` BOOLEAN NOT NULL,
    `availableOnlyOnline` BOOLEAN NOT NULL,
    `organic` BOOLEAN NOT NULL,
    `featured` BOOLEAN NOT NULL,
    `productCode` VARCHAR(191) NOT NULL,
    `vintage` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `largeImage` VARCHAR(191) NOT NULL,
    `buyLink` VARCHAR(191) NOT NULL,
    `sortiment` VARCHAR(191) NOT NULL,
    `tagLine` VARCHAR(191) NOT NULL,
    `producerDescription` LONGTEXT NOT NULL,
    `producerUrl` VARCHAR(191) NOT NULL,
    `region` VARCHAR(191) NOT NULL,
    `taste` JSON NOT NULL,
    `awards` VARCHAR(191) NOT NULL,
    `additionalInfo` VARCHAR(191) NOT NULL,
    `vegetables` BOOLEAN NOT NULL,
    `roastedVegetables` BOOLEAN NOT NULL,
    `softCheese` BOOLEAN NOT NULL,
    `hardCheese` BOOLEAN NOT NULL,
    `starches` BOOLEAN NOT NULL,
    `fish` BOOLEAN NOT NULL,
    `richFish` BOOLEAN NOT NULL,
    `whiteMeatPoultry` BOOLEAN NOT NULL,
    `lambMeat` BOOLEAN NOT NULL,
    `porkMeat` BOOLEAN NOT NULL,
    `redMeatBeef` BOOLEAN NOT NULL,
    `gameMeat` BOOLEAN NOT NULL,
    `curedMeat` BOOLEAN NOT NULL,
    `sweets` BOOLEAN NOT NULL,
    `bottleVolume` DOUBLE NOT NULL,
    `alcohol` DOUBLE NOT NULL,
    `composition` VARCHAR(191) NOT NULL,
    `closure` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
