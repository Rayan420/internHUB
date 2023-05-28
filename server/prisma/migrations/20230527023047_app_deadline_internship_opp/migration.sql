/*
  Warnings:

  - Added the required column `applicationDeadline` to the `InternshipOpportunity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `internshipopportunity` ADD COLUMN `applicationDeadline` DATETIME(3) NOT NULL;
