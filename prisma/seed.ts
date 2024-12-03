import { PrismaClient, Gender } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed ExpenseType
  const expenseType1 = await prisma.expenseType.create({
    data: {
      name: "Office Supplies",
      description: "Expenses related to office supplies",
    },
  });

  const expenseType2 = await prisma.expenseType.create({
    data: {
      name: "Maintenance",
      description: "Building and equipment maintenance",
    },
  });

  // Seed Test
  const test1 = await prisma.test.create({
    data: {
      name: "Blood Test",
      description: "Routine blood test",
      price: 500.0,
    },
  });

  const test2 = await prisma.test.create({
    data: {
      name: "X-Ray",
      description: "Chest X-Ray",
      price: 1000.0,
    },
  });

  // Seed Patients
  const patient1 = await prisma.patient.create({
    data: {
      name: "John Doe",
      phone: "1234567890",
      address: "123 Main St",
      bloodType: "O+",
      gender: Gender.MALE,
      dateOfBirth: new Date("1990-01-01"),
    },
  });

  const patient2 = await prisma.patient.create({
    data: {
      name: "Jane Smith",
      phone: "9876543210",
      address: "456 Elm St",
      bloodType: "A-",
      gender: Gender.FEMALE,
      dateOfBirth: new Date("1985-05-15"),
    },
  });

  // Seed ReferredBy
  const referredBy1 = await prisma.referredBy.create({
    data: {
      name: "Dr. Miller",
      phone: "5551234567",
    },
  });

  const referredBy2 = await prisma.referredBy.create({
    data: {
      name: "Dr. Davis",
      phone: "5559876543",
    },
  });

  // Seed PerformedBy
  const performedBy1 = await prisma.performedBy.create({
    data: {
      name: "Lab Tech A",
      phone: "5555555555",
    },
  });

  const performedBy2 = await prisma.performedBy.create({
    data: {
      name: "Lab Tech B",
      phone: "5556666666",
    },
  });

  // Seed Memo
  await prisma.memo.create({
    data: {
      patientId: patient1.id,
      testId: test1.id,
      referredById: referredBy1.id,
      performedById: performedBy1.id,
      amount: 500.0,
    },
  });

  await prisma.memo.create({
    data: {
      patientId: patient2.id,
      testId: test2.id,
      referredById: referredBy2.id,
      performedById: performedBy2.id,
      amount: 1000.0,
    },
  });

  // Seed Expense
  await prisma.expense.create({
    data: {
      description: "Bought office chairs",
      amount: 3000.0,
      expenseTypeId: expenseType1.id,
      date: new Date(),
    },
  });

  await prisma.expense.create({
    data: {
      description: "Air conditioner repair",
      amount: 5000.0,
      expenseTypeId: expenseType2.id,
      date: new Date(),
    },
  });

  // Seed Asset
  await prisma.asset.create({
    data: {
      name: "MRI Machine",
      description: "High-resolution MRI scanner",
      value: 1000000.0,
    },
  });

  await prisma.asset.create({
    data: {
      name: "Ultrasound Machine",
      description: "Portable ultrasound scanner",
      value: 500000.0,
    },
  });

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
