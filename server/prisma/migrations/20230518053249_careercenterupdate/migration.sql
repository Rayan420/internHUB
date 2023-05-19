/*
  Warnings:

  - A unique constraint covering the columns `[companyName]` on the table `CareerCenter` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `CareerCenter_companyName_key` ON `CareerCenter`(`companyName`);
