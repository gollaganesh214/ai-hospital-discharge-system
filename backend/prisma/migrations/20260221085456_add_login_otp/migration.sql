-- CreateTable
CREATE TABLE "LoginOtp" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginOtp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LoginOtp_email_expiresAt_idx" ON "LoginOtp"("email", "expiresAt");
