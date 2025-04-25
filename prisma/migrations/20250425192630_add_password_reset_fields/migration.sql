-- AlterTable
ALTER TABLE `user` ADD COLUMN `passwordResetCode` VARCHAR(191) NULL,
    ADD COLUMN `passwordResetExpires` DATETIME(3) NULL,
    ADD COLUMN `passwordResetVerify` BOOLEAN NOT NULL DEFAULT false;
