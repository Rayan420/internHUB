/*
  Warnings:

  - You are about to drop the column `internshipFormURL` on the `internshipform` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `internshipform` DROP COLUMN `internshipFormURL`,
    ADD COLUMN `applicationFileURL` VARCHAR(255) NULL;
