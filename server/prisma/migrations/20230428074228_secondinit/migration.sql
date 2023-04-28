-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'student', 'center', 'coordinator');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'student';
