import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Patients
  const patient1 = await prisma.patient.create({
    data: {
      name: 'John Doe',
      phone: '12345678907',
      address: '123 Main Street',
      bloodType: 'O+',
      gender: 'MALE',
      dateOfBirth: new Date('1990-01-01'),
    },
  });

  const patient2 = await prisma.patient.create({
    data: {
      name: 'Jane Smith',
      phone: '09876543241',
      address: '456 Elm Street',
      bloodType: 'A+',
      gender: 'FEMALE',
      dateOfBirth: new Date('1985-06-15'),
    },
  });

  // Seed Expense Types
  const expenseType1 = await prisma.expenseType.create({
    data: {
      name: 'Utilities',
      description: 'Expenses related to utilities like electricity, water, etc.',
    },
  });

  const expenseType2 = await prisma.expenseType.create({
    data: {
      name: 'Maintenance',
      description: 'General maintenance expenses for the center.',
    },
  });

  // Seed Expenses
  await prisma.expense.createMany({
    data: [
      {
        description: 'Electricity bill for June',
        amount: 200.5,
        expenseTypeId: expenseType1.id,
      },
      {
        description: 'Air conditioning repair',
        amount: 150.75,
        expenseTypeId: expenseType2.id,
      },
    ],
  });

  // Seed Tests
  const test1 = await prisma.test.create({
    data: {
      name: 'Complete Blood Count (CBC)',
      description: 'A basic blood test to check overall health.',
      testCost: 100.0,
      additionalCost: 20.0,
      price: 120.0,
    },
  });

  const test2 = await prisma.test.create({
    data: {
      name: 'Lipid Panel',
      description: 'A test to measure cholesterol and triglycerides.',
      testCost: 150.0,
      additionalCost: 30.0,
      price: 180.0,
    },
  });

  // Seed ReferredBy and PerformedBy
  const referredBy1 = await prisma.referredBy.create({
    data: {
      name: 'Dr. Alex Johnson',
      phone: '1122334455',
    },
  });

  const performedBy1 = await prisma.performedBy.create({
    data: {
      name: 'Lab Technician Mike',
      phone: '2233445566',
    },
  });

  // Seed Memos
  await prisma.memo.createMany({
    data: [
      {
        patientId: patient1.id,
        testId: test1.id,
        referredById: referredBy1.id,
        performedById: performedBy1.id,
        paymentMethod: 'PAID',
        paidAmount: 120.0,
        dueAmount: 0.0,
        totalAmount: 120.0,
      },
      {
        patientId: patient2.id,
        testId: test2.id,
        performedById: performedBy1.id,
        paymentMethod: 'DUE',
        paidAmount: 100.0,
        dueAmount: 80.0,
        totalAmount: 180.0,
      },
    ],
  });

  // Seed Assets
  await prisma.asset.createMany({
    data: [
      {
        name: 'Ultrasound Machine',
        description: 'High-quality ultrasound machine for diagnostics.',
        value: 25000.0,
      },
      {
        name: 'X-Ray Machine',
        description: 'Digital X-Ray machine for detailed imaging.',
        value: 30000.0,
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
