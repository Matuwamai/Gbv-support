/*
  Warnings:

  - Added the required column `postId` to the `Case` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Case` ADD COLUMN `postId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Case` ADD CONSTRAINT `Case_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
