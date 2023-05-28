/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `InternshipOpportunity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `InternshipOpportunity_id_key` ON `InternshipOpportunity`(`id`);
