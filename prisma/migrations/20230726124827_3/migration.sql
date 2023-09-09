/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - Made the column `authorId` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_authorId_fkey`;

-- AlterTable
ALTER TABLE `Message` MODIFY `authorId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Room_name_key` ON `Room`(`name`);

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
