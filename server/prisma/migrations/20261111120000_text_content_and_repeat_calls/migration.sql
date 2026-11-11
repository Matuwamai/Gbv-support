-- DropIndex
DROP INDEX `EmergencyCall_phoneNumber_key` ON `EmergencyCall`;

-- AlterTable
ALTER TABLE `Post` MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Comment` MODIFY `content` TEXT NOT NULL;

