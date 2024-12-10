import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed Patients
  const [patient1, patient2] = await Promise.all([
    prisma.patient.create({
      data: {
        name: "John Doe",
        phone: "12345678907",
        address: "123 Main Street",
        bloodType: "O+",
        gender: "MALE",
        dateOfBirth: new Date("1990-01-01"),
      },
    }),
    prisma.patient.create({
      data: {
        name: "Jane Smith",
        phone: "09876543241",
        address: "456 Elm Street",
        bloodType: "A+",
        gender: "FEMALE",
        dateOfBirth: new Date("1985-06-15"),
      },
    }),
  ]);

  // Seed Expense Types
  const [expenseType1, expenseType2] = await Promise.all([
    prisma.expenseType.create({
      data: {
        name: "Utilities",
        description: "Expenses related to utilities like electricity, water, etc.",
      },
    }),
    prisma.expenseType.create({
      data: {
        name: "Maintenance",
        description: "General maintenance expenses for the center.",
      },
    }),
  ]);

  // Seed Expenses
  await prisma.expense.createMany({
    data: [
      {
        title: "Electricity for June",
        description: "Electricity bill for June",
        amount: 200.5,
        expenseTypeId: expenseType1.id, // Reference fetched ID
      },
      {
        title: "AC Repair",
        description: "Air conditioning repair",
        amount: 150.75,
        expenseTypeId: expenseType2.id, // Reference fetched ID
      },
    ],
  });

  // Seed Tests
  const [test1, test2] = await Promise.all([
    prisma.test.create({
      data: {
        name: "Complete Blood Count (CBC)",
        description: "A basic blood test to check overall health.",
        testCost: 100.0,
        additionalCost: 20.0,
        price: 120.0,
      },
    }),
    prisma.test.create({
      data: {
        name: "Lipid Panel",
        description: "A test to measure cholesterol and triglycerides.",
        testCost: 150.0,
        additionalCost: 30.0,
        price: 180.0,
      },
    }),
  ]);

  // Seed ReferredBy and PerformedBy
  const [referredBy1, performedBy1] = await Promise.all([
    prisma.referredBy.create({
      data: {
        name: "Dr. Alex Johnson",
        phone: "1122334455",
      },
    }),
    prisma.performedBy.create({
      data: {
        name: "Lab Technician Mike",
        phone: "2233445566",
      },
    }),
  ]);

  // Seed Memos
  await prisma.memo.createMany({
    data: [
      {
        patientId: patient1.id,
        testId: test1.id,
        referredById: referredBy1.id,
        performedById: performedBy1.id,
        paymentMethod: "PAID",
        paidAmount: 120.0,
        dueAmount: 0.0,
        totalAmount: 120.0,
      },
      {
        patientId: patient2.id,
        testId: test2.id,
        performedById: performedBy1.id,
        paymentMethod: "DUE",
        paidAmount: 100.0,
        dueAmount: 80.0,
        totalAmount: 180.0,
      },
    ],
  });

  // Seed Assets with the new model fields (amount, qty, value, purchasedBy)
  await prisma.asset.createMany({
    data: [
      {
        name: "Ultrasound Machine",
        description: "High-quality ultrasound machine for diagnostics.",
        amount: 1, 
        qty: 10, 
        value: 25000.0,
        purchasedBy: "John Doe", 
      },
      {
        name: "X-Ray Machine",
        description: "Digital X-Ray machine for detailed imaging.",
        amount: 1, 
        qty: 5, 
        value: 30000.0,
        purchasedBy: "Jane Smith", 
      },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
