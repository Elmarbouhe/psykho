/*
  Warnings:

  - Added the required column `ai_action` to the `daily_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "daily_logs" ADD COLUMN     "ai_action" TEXT NOT NULL;
