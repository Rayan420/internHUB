/*
  Warnings:

  - You are about to drop the column `transcriptFile` on the `letterrequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `letterrequest` DROP COLUMN `transcriptFile`,
    ADD COLUMN `transcriptFileURL` VARCHAR(255) NULL;
