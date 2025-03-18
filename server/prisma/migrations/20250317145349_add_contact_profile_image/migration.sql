/*
  Warnings:

  - You are about to drop the column `postId` on the `Case` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `EmergencyCall` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[postId]` on the table `LikeDislike` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,postId,commentId]` on the table `LikeDislike` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Case` DROP FOREIGN KEY `Case_postId_fkey`;

-- DropIndex
DROP INDEX `Case_postId_key` ON `Case`;

-- AlterTable
ALTER TABLE `Case` DROP COLUMN `postId`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `contact` VARCHAR(191) NULL,
    ADD COLUMN `profileImage` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `EmergencyCall_phoneNumber_key` ON `EmergencyCall`(`phoneNumber`);

-- CreateIndex
CREATE UNIQUE INDEX `LikeDislike_postId_key` ON `LikeDislike`(`postId`);

-- CreateIndex
CREATE UNIQUE INDEX `LikeDislike_userId_postId_commentId_key` ON `LikeDislike`(`userId`, `postId`, `commentId`);
