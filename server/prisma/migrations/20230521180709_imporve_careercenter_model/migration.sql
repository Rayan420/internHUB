-- AlterTable
ALTER TABLE `coordinator` ADD COLUMN `careerCenterId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Coordinator` ADD CONSTRAINT `Coordinator_careerCenterId_fkey` FOREIGN KEY (`careerCenterId`) REFERENCES `CareerCenter`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
