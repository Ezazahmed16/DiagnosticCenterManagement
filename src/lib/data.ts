export let role = "admin";

export const patientData = [
    {
        id: 1,
        patientId: "P1234567890",
        name: "Ezaz Ahmed",
        number: "+8801726065822",
        email: "ezazrahul794@gmail.com",
        age: 28,
        gender: "Male",
        address: "123 Main St, Dhaka, Bangladesh",
        status: "Due",
        memoId: ["5251", "16282"],
        registrationDate: "2024-10-25"
    },
    {
        id: 2,
        patientId: "P0987654321",
        name: "Sarah Khan",
        number: "+8801781234567",
        email: "sarah.khan@example.com",
        age: 35,
        gender: "Female",
        address: "456 Elm St, Chittagong, Bangladesh",
        status: "Paid",
        memoId: ["6734"],
        registrationDate: "2024-10-20"
    }
];

export const memoData = [
    {
        id: 1,
        memoId: "5251",
        patientId: "P1234567890",
        memoTest: ["1", "2"],
        totalAmount: 1500,
        pay: 1000,
        due: 500,
        status: "Due",
        issueDate: "2024-11-01",
        paymentDueDate: "2024-11-10"
    },
    {
        id: 2,
        memoId: "16282",
        patientId: "P1234567890",
        memoTest: ["2", "3"],
        totalAmount: 2000,
        pay: 2000,
        due: 0,
        status: "Paid",
        issueDate: "2024-10-18",
        paymentDueDate: "2024-10-28"
    },
    {
        id: 3,
        memoId: "6734",
        patientId: "P0987654321",
        memoTest: ["1"],
        totalAmount: 1000,
        pay: 1000,
        due: 0,
        status: "Paid",
        issueDate: "2024-10-21",
        paymentDueDate: "2024-10-30"
    }
];

export const testData = [
    {
        testId: "1",
        testName: "Complete Blood Count",
        price: 1000,
        additionalCost: 200,
        totalCost: 1200,
        description: "A test that evaluates overall health and detects a variety of disorders, including anemia and infection."
    },
    {
        testId: "2",
        testName: "Liver Function Test",
        price: 1500,
        additionalCost: 0,
        totalCost: 1500,
        description: "A test to measure the levels of enzymes and proteins in the blood to assess liver health."
    },
    {
        testId: "3",
        testName: "Kidney Function Test",
        price: 1800,
        additionalCost: 0,
        totalCost: 1800,
        description: "A test that evaluates kidney health by measuring levels of certain substances in the blood."
    }
];
