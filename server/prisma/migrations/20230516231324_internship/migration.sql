/*
  Warnings:

  - You are about to drop the column `transcriptFile` on the `internshipform` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `internshipform` DROP COLUMN `transcriptFile`,
    ADD COLUMN `internshipFormURL` BLOB NULL,
    ADD COLUMN `rejectionReason` VARCHAR(191) NULL,
    ADD COLUMN `transcriptFileURL` BLOB NULL;

-- AlterTable
ALTER TABLE `letterrequest` ADD COLUMN `rejectionReason` VARCHAR(191) NULL;
