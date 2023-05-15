-- DropForeignKey
ALTER TABLE `department` DROP FOREIGN KEY `Department_coordinatorId_fkey`;

-- AlterTable
ALTER TABLE `department` MODIFY `coordinatorId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Department` ADD CONSTRAINT `Department_coordinatorId_fkey` FOREIGN KEY (`coordinatorId`) REFERENCES `Coordinator`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
