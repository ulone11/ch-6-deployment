/*
  Warnings:

  - Added the required column `imagekit_fileId` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "imagekit_fileId" TEXT NOT NULL;
