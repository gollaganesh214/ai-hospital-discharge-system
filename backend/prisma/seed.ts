import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@hospital.local";
  const adminPassword = "Admin@12345";

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        role: "ADMIN"
      }
    });
  }

  const patient = await prisma.patient.create({
    data: {
      mrn: `MRN-${Date.now()}`,
      firstName: "Asha",
      lastName: "Verma",
      dob: new Date("1992-06-04"),
      gender: "F",
      phone: "555-0101",
      address: "12 Lakeview Road"
    }
  });

  const admission = await prisma.admission.create({
    data: {
      patientId: patient.id,
      diagnosis: "Community acquired pneumonia",
      attendingPhysician: "Dr. Rao"
    }
  });

  await prisma.labReport.create({
    data: {
      patientId: patient.id,
      testName: "CBC",
      result: "Normal",
      status: "COMPLETED"
    }
  });

  await prisma.dischargeSummary.create({
    data: {
      admissionId: admission.id,
      summaryText: "Patient stabilized and improving. Discharged with antibiotics.",
      medications: "Amoxicillin 500mg",
      followUp: "Review in 2 weeks",
      aiSuggested: false
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
