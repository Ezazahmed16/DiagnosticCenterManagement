import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed Expense Types
  const expenseType1 = await prisma.expenseType.upsert({
    where: { name: "Utilities" },
    update: {},
    create: {
      name: "Utilities",
      description: "Expenses related to utilities like electricity, water, etc.",
    },
  });

  const expenseType2 = await prisma.expenseType.upsert({
    where: { name: "Maintenance" },
    update: {},
    create: {
      name: "Maintenance",
      description: "General maintenance expenses for the center.",
    },
  });

  // Seed Patients
  const patient1 = await prisma.patient.upsert({
    where: { phone: "12345678907" },
    update: {},
    create: {
      name: "John Doe",
      phone: "12345678907",
      address: "123 Main Street",
      bloodType: "O+",
      gender: "MALE",
      dateOfBirth: "24",
    },
  });

  const patient2 = await prisma.patient.upsert({
    where: { phone: "09876543241" },
    update: {},
    create: {
      name: "Jane Smith",
      phone: "09876543241",
      address: "456 Elm Street",
      bloodType: "A+",
      gender: "FEMALE",
      dateOfBirth: "32",
    },
  });

  // Seed Expenses
  await prisma.expense.createMany({
    data: [
      {
        title: "Electricity Bill",
        description: "Monthly electricity bill for December.",
        amount: 300.0,
        expenseTypeId: expenseType1.id,
        date: new Date("2023-12-01"),
      },
      {
        title: "Water Bill",
        description: "Monthly water bill for December.",
        amount: 100.0,
        expenseTypeId: expenseType1.id,
        date: new Date("2023-12-01"),
      },
      {
        title: "AC Maintenance",
        description: "Annual maintenance for air conditioning units.",
        amount: 500.0,
        expenseTypeId: expenseType2.id,
        date: new Date("2023-12-05"),
      },
    ],
    skipDuplicates: true,
  });

  console.log("Expenses seeded successfully!");

  // Seed ReferredBy
  const referredBy1 = await prisma.referredBy.upsert({
    where: { phone: "1122334455" },
    update: {},
    create: {
      name: "Dr. Alex Johnson",
      phone: "1122334455",
      commissionPercent: 10,
      totalAmount: 0,
    },
  });

  // Seed PerformedBy
  const performedBy1 = await prisma.performedBy.upsert({
    where: { phone: "2233445566" },
    update: {},
    create: {
      name: "Lab Technician Mike",
      phone: "2233445566",
    },
  });

  // Seed Tests
  const test1 = await prisma.test.upsert({
    where: { name: "Complete Blood Count (CBC)" },
    update: {},
    create: {
      name: "Complete Blood Count (CBC)",
      description: "A basic blood test to check overall health.",
      testCost: 100.0,
      additionalCost: 20.0,
      price: 120.0,
      roomNo: "A1",
      deliveryTime: "2 hours",
    },
  });

  const test2 = await prisma.test.upsert({
    where: { name: "Lipid Panel" },
    update: {},
    create: {
      name: "Lipid Panel",
      description: "A test to measure cholesterol and triglycerides.",
      testCost: 150.0,
      additionalCost: 30.0,
      price: 180.0,
      roomNo: "B2",
      deliveryTime: "1 hour",
    },
  });

  // Seed Memos
  const memo1 = await prisma.memo.create({
    data: {
      name: "Memo for John Doe",
      phone: patient1.phone,
      gender: "MALE",
      referredById: referredBy1.id,
      // performedById: performedBy1.id,
      paymentMethod: "PAID",
      totalAmount: 120.0,
      paidAmount: 120.0,
      dueAmount: 0.0,
      discount: 0.0,
    },
  });

  const memo2 = await prisma.memo.create({
    data: {
      name: "Memo for Jane Smith",
      phone: patient2.phone,
      gender: "FEMALE",
      referredById: referredBy1.id,
      // performedById: performedBy1.id,
      paymentMethod: "DUE",
      totalAmount: 180.0,
      paidAmount: 100.0,
      dueAmount: 80.0,
      discount: 0.0,
    },
  });

  // Seed MemoToTest
  await prisma.memoToTest.createMany({
    data: [
      {
        memoId: memo1.id,
        testId: test1.id,
      },
      {
        memoId: memo2.id,
        testId: test2.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Memos and Tests seeded successfully!");

  // Update totalAmount for ReferredBy (commission calculation)
  const referredMemos = await prisma.memo.findMany({
    where: { referredById: referredBy1.id },
  });

  const totalCommission = referredMemos.reduce(
    (sum, memo) => sum + memo.totalAmount * (referredBy1.commissionPercent / 100),
    0
  );

  await prisma.referredBy.update({
    where: { id: referredBy1.id },
    data: { totalAmount: totalCommission },
  });

  // Seed Assets
  await prisma.asset.createMany({
    data: [
      {
        name: "Ultrasound Machine",
        description: "High-resolution ultrasound imaging device.",
        amount: 1,
        qty: 1,
        value: 20000.0,
        purchasedBy: "Admin",
      },
      {
        name: "MRI Scanner",
        description: "Advanced magnetic resonance imaging system.",
        amount: 1,
        qty: 1,
        value: 75000.0,
        purchasedBy: "Admin",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Assets seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
