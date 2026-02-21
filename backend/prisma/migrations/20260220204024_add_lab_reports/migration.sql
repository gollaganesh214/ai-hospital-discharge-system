-- CreateTable
CREATE TABLE "LabReport" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "testName" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "unit" TEXT,
    "normalRange" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "collectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reportedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LabReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LabReport" ADD CONSTRAINT "LabReport_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
