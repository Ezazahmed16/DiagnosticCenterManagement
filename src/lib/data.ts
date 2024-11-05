// Enum Data
export const RoleEnum = {
    SUPER_ADMIN: "super admin",
    ADMIN: "admin",
    RECEPTIONIST: "receptionist",
    ACCOUNT: "account",
    LAB_TECHNICIAN: "lab technician",
    NURSE: "nurse"
};

export let role = "admin";
// export let role = "accounts";
// export let role = "receptionist";

// PatientData 
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

// Memos Data 
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

// All Tests Data 
export const testData = [
    {
        testId: "1",
        testName: "Complete Blood Count",
        price: 1000,
        additionalCost: 0,
        totalCost: 1000 + 0,
        description: "A test that evaluates overall health and detects a variety of disorders, including anemia and infection."
    },
    {
        testId: "2",
        testName: "Liver Function Test",
        price: 1200,
        additionalCost: 150,
        totalCost: 1200 + 150,
        description: "Assesses liver health by measuring levels of proteins, liver enzymes, and bilirubin in the blood."
    },
    {
        testId: "3",
        testName: "Kidney Function Test",
        price: 900,
        additionalCost: 100,
        totalCost: 900 + 100,
        description: "Measures levels of substances like creatinine and urea to assess kidney function and health."
    },
    {
        testId: "4",
        testName: "Blood Glucose Test",
        price: 500,
        additionalCost: 0,
        totalCost: 500 + 0,
        description: "Measures blood glucose levels to diagnose and monitor diabetes and other glucose-related conditions."
    },
    {
        testId: "5",
        testName: "Thyroid Function Test",
        price: 1100,
        additionalCost: 150,
        totalCost: 1100 + 150,
        description: "Evaluates thyroid gland function by measuring levels of T3, T4, and TSH hormones in the blood."
    },
    {
        testId: "6",
        testName: "Lipid Profile",
        price: 1300,
        additionalCost: 0,
        totalCost: 1300 + 0,
        description: "A panel of blood tests measuring cholesterol and triglyceride levels to assess cardiovascular health."
    },
    {
        testId: "7",
        testName: "Urine Analysis",
        price: 400,
        additionalCost: 0,
        totalCost: 400 + 0,
        description: "Examines urine content and properties to detect a variety of conditions, including infections and kidney disease."
    },
    {
        testId: "8",
        testName: "Electrolyte Panel",
        price: 800,
        additionalCost: 0,
        totalCost: 800 + 0,
        description: "Measures electrolyte levels, including sodium, potassium, and chloride, to assess hydration and organ function."
    },
    {
        testId: "9",
        testName: "Hemoglobin A1c Test",
        price: 700,
        additionalCost: 0,
        totalCost: 700 + 0,
        description: "Measures average blood glucose levels over the past 3 months to monitor diabetes management."
    },
    {
        testId: "10",
        testName: "Vitamin D Test",
        price: 900,
        additionalCost: 0,
        totalCost: 900 + 0,
        description: "Measures the level of vitamin D in the blood, which is important for bone health and immune function."
    }
];

// All User Data 
export const userData = [
    {
        userId: "1",
        userName: "Ezaz Ahmed",
        userEmail: "ezazrahul794@gmail.com",
        userPassword: "123456",
        role: [RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.RECEPTIONIST],
        userNumber: "017234567"
    },
    {
        userId: "2",
        userName: "Ayesha Rahman",
        userEmail: "ayesha.rahman@example.com",
        userPassword: "654321",
        role: [RoleEnum.ADMIN, RoleEnum.ACCOUNT],
        userNumber: "017987654"
    },
    {
        userId: "3",
        userName: "Fahim Islam",
        userEmail: "fahim.islam@example.com",
        userPassword: "112233",
        role: [RoleEnum.RECEPTIONIST, RoleEnum.LAB_TECHNICIAN],
        userNumber: "017345678"
    },
    {
        userId: "4",
        userName: "Nadia Karim",
        userEmail: "nadia.karim@example.com",
        userPassword: "998877",
        role: [RoleEnum.NURSE, RoleEnum.RECEPTIONIST],
        userNumber: "017456789"
    }
];

// All Referals Data
export const referalsData = [
    {
        referalsId: "1",
        referalsName: "JR. Hasan",
        referalsCommission: "5%",
        totalAmmount: 10000,
        ammountPaid: 7000,
        totalDue: 3000,
    },
    {
        referalsId: "2",
        referalsName: "Ayesha Khan",
        referalsCommission: "7%",
        totalAmmount: 15000,
        ammountPaid: 10500,
        totalDue: 4500,
    },
    {
        referalsId: "3",
        referalsName: "Robert Lee",
        referalsCommission: "4%",
        totalAmmount: 8000,
        ammountPaid: 4000,
        totalDue: 4000,
    },
    {
        referalsId: "4",
        referalsName: "Sophia Brown",
        referalsCommission: "6%",
        totalAmmount: 20000,
        ammountPaid: 12000,
        totalDue: 8000,
    },
    {
        referalsId: "5",
        referalsName: "Ali Khan",
        referalsCommission: "5%",
        totalAmmount: 12000,
        ammountPaid: 9000,
        totalDue: 3000,
    },
];

// All Expenses Data
export const expensesData = [
    {
        expenseId: "1",
        expenseTitle: "Office Rent",
        expenseAmount: 3000,
        expenseCategory: "Rent",
        expenseDate: "2024-10-01",
    },
    {
        expenseId: "2",
        expenseTitle: "Internet Bill",
        expenseAmount: 100,
        expenseCategory: "Utilities",
        expenseDate: "2024-10-05",
    },
    {
        expenseId: "3",
        expenseTitle: "Office Supplies",
        expenseAmount: 150,
        expenseCategory: "Supplies",
        expenseDate: "2024-10-08",
    },
    {
        expenseId: "4",
        expenseTitle: "Electricity Bill",
        expenseAmount: 200,
        expenseCategory: "Utilities",
        expenseDate: "2024-10-10",
    },
    {
        expenseId: "5",
        expenseTitle: "Employee Lunch",
        expenseAmount: 250,
        expenseCategory: "Meals",
        expenseDate: "2024-10-12",
    },
    {
        expenseId: "6",
        expenseTitle: "Software Subscription",
        expenseAmount: 50,
        expenseCategory: "Software",
        expenseDate: "2024-10-15",
    },
    {
        expenseId: "7",
        expenseTitle: "Travel Expenses",
        expenseAmount: 500,
        expenseCategory: "Travel",
        expenseDate: "2024-10-18",
    },
    {
        expenseId: "8",
        expenseTitle: "Marketing Materials",
        expenseAmount: 300,
        expenseCategory: "Marketing",
        expenseDate: "2024-10-20",
    },
    {
        expenseId: "9",
        expenseTitle: "Client Meeting",
        expenseAmount: 150,
        expenseCategory: "Entertainment",
        expenseDate: "2024-10-25",
    },
    {
        expenseId: "10",
        expenseTitle: "Office Cleaning",
        expenseAmount: 100,
        expenseCategory: "Maintenance",
        expenseDate: "2024-10-28",
    },
];





