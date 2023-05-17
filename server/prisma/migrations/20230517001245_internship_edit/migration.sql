-- DropForeignKey
ALTER TABLE `internshipform` DROP FOREIGN KEY `InternshipForm_careerCenterId_fkey`;

-- AlterTable
ALTER TABLE `internshipform` MODIFY `careerCenterId` INTEGER NULL,
    MODIFY `responseDate` DATETIME(3) NULL;

-- AddForeignKey
ALTER TABLE `InternshipForm` ADD CONSTRAINT `InternshipForm_careerCenterId_fkey` FOREIGN KEY (`careerCenterId`) REFERENCES `CareerCenter`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
