/*
  Warnings:

  - You are about to alter the column `internshipFormURL` on the `internshipform` table. The data in that column could be lost. The data in that column will be cast from `Blob` to `VarChar(255)`.
  - You are about to alter the column `transcriptFileURL` on the `internshipform` table. The data in that column could be lost. The data in that column will be cast from `Blob` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE `internshipform` MODIFY `internshipFormURL` VARCHAR(255) NULL,
    MODIFY `transcriptFileURL` VARCHAR(255) NULL;
