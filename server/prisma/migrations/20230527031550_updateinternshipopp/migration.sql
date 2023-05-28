/*
  Warnings:

  - Added the required column `careerCenterId` to the `InternshipOpportunity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `internshipopportunity` ADD COLUMN `careerCenterId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `InternshipOpportunity` ADD CONSTRAINT `InternshipOpportunity_careerCenterId_fkey` FOREIGN KEY (`careerCenterId`) REFERENCES `CareerCenter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
