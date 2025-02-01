import { z } from "zod";

// Patient
export const patientSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(3, { message: "Patient name must be at least 3 characters long!" }),
    phone: z
        .string()
        .min(10, { message: "Phone number must be at least 10 digits long!" }),
    gender: z.enum(["MALE", "FEMALE", "OTHER"], { message: "Gender is required!" }),
    dateOfBirth: z.string().optional(),
    address: z.string().optional(),
    bloodType: z.string().optional(),
});

export type PatientSchema = z.infer<typeof patientSchema>;

// Memo schema
export const memoSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(3, { message: "Patient name must be at least 3 characters long!" }),
    phone: z.string().min(10, { message: "Phone number must be at least 10 digits long!" }),
    gender: z.enum(["MALE", "FEMALE", "OTHER"], { message: "Gender is required!" }),
    dateOfBirth: z.string().optional(),
    address: z.string().optional(),
    referredById: z.string().uuid().nullable().optional(),

    // Test data (memoTest)
    memoTest: z.array(
        z.object({
            id: z.string().uuid({ message: "Test ID must be a valid UUID!" }),
            testName: z.string().min(3, { message: "Test name must be at least 3 characters long!" }),
            price: z.number().positive({ message: "Price must be a positive number!" }),
            roomNo: z.string().optional(),
            deliveryTime: z.string().optional(),
            performedById: z.string().refine(val => val === "" || val === null || z.string().uuid().safeParse(val).success, {
                message: "Invalid UUID or empty string for performedById"
            }).optional(),
        })
    ).optional(),


    // Financial details
    paidAmount: z.number().positive({ message: "Paid amount must be a positive number!" }).optional(),
    dueAmount: z.number().nonnegative({ message: "Due amount must be zero or a positive number!" }).optional(),
    totalAmount: z.number().positive({ message: "Total amount must be a positive number!" }).optional(),
    discount: z.number().nonnegative({ message: "Discount must be a non-negative number!" }).optional(),

    // Payment method (optional)
    paymentMethod: z.enum(["PAID", "DUE"]).optional(), // Fixed to "PAID" or "DUE"

    // Relations
    performedBy: z.string().uuid().optional(), // If you want to assign a performer directly to the memo, keep it optional
    referredBy: z.string().uuid().nullable().optional(), // Optional referral ID for the memo
});

export type MemoSchema = z.infer<typeof memoSchema>;


// Test
export const testSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(3, { message: "Test name must be at least 3 characters long!" }),
    description: z.string().optional(),
    testCost: z.number().nonnegative({ message: "Test cost must be non-negative!" }),
    additionalCost: z.number().nonnegative({ message: "Additional cost must be non-negative!" }),
    price: z.number().positive({ message: "Price must be a positive number!" }),
    roomNo: z.string().max(10, { message: "Room number cannot exceed 10 characters!" }).optional(),
    deliveryTime: z.string().optional(),
    PerformedBy: z.string().uuid().optional(),
    memos: z.array(
        z.object({
            Memo: z.object({
                id: z.string().uuid(),
                patientId: z.string().uuid().nullable(),
                referredById: z.string().uuid().nullable(),
                totalAmount: z.number(),
                dueAmount: z.number(),
                paidAmount: z.number(),
                performedById: z.string().uuid(),
                createdAt: z.string(), // Use `z.date()` if the date is already converted
                updatedAt: z.string(),
            }),
        })
    ).optional(), // Make the relation optional
});

export type TestSchema = z.infer<typeof testSchema>;

// PerformedBy
export const performedBySchema = z.object({
    id: z.string().uuid().optional(),
    name: z
        .string()
        .min(3, { message: "Name must be at least 3 characters long!" })
        .max(50, { message: "Name cannot exceed 50 characters!" }),
    phone: z
        .string()
        .regex(/^\d{10,15}$/, { message: "Phone number must be 10-15 digits long!" })
        .optional(),
    commission: z
        .number()
        .min(0, { message: "Commission percentage cannot be negative!" })
        .max(100, { message: "Commission percentage cannot exceed 100%!" })
        .optional(),
    totalPerformed: z
        .number()
        .int()
        .min(0, { message: "Total performed tests cannot be negative!" })
        .optional(),
    totalAmount: z
        .number()
        .min(0, { message: "Total amount cannot be negative!" })
        .optional(),
    payable: z
        .number()
        .min(0, { message: "Payable amount cannot be negative!" })
        .optional(),
    dueAmount: z
        .number()
        .min(0, { message: "Due amount cannot be negative!" })
        .optional(),
    paidAmounts: z
        .number()
        .min(0, { message: "Paid amount cannot be negative!" })
        .optional(),
    pay: z.number().min(0, "Pay must be a positive number").optional(),

});

export type PerformedBySchema = z.infer<typeof performedBySchema>;


// Referral Schema
export const referredBySchema = z.object({
    id: z.string().optional(), // For updates
    name: z.string().min(1, "Referral name is required"),
    phone: z.string().min(10, "Phone number is required"),
    commissionPercent: z.number().min(0, "Commission percent must be non-negative"),
    totalAmmount: z.number().min(0, "Total amount must be non-negative").optional(),
    payments: z
        .array(
            z.object({
                amount: z.number().min(0, "Amount must be non-negative"),
                date: z
                    .string()
                    .refine(
                        (value) => /^\d{4}-\d{2}-\d{2}$/.test(value), // Validate YYYY-MM-DD format
                        {
                            message: "Invalid date format. Use YYYY-MM-DD.",
                        }
                    ),
                referredById: z.string().optional(),
            })
        )
        .optional(),
});

export type ReferredBySchema = z.infer<typeof referredBySchema>;

// Expense Schema
export const expenseSchema = z.object({
    id: z.string().uuid().optional(),

    title: z
        .string()
        .trim()
        .min(3, { message: "Title must be at least 3 characters long!" })
        .max(50, { message: "Title must be at most 50 characters long!" }),

    description: z
        .string()
        .max(300, { message: "Description must not exceed 300 characters!" })
        .optional()
        .transform((val) => (val === "" ? undefined : val)),

    amount: z
        .union([z.string(), z.number()])
        .refine((val) => val !== "", { message: "Amount is required!" })
        .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
        .refine((val) => !isNaN(val) && val > 0, { message: "Amount must be a positive number!" }),

    date: z
        .union([z.string(), z.date()])
        .optional()
        .transform((val) => {
            if (!val) return new Date();
            const parsedDate = typeof val === "string" ? new Date(val) : val;
            return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
        }),

    expenseTypeId: z
        .string()
        .trim()
        .min(1, { message: "Expense Type is required!" })
        .uuid({ message: "Invalid Expense Type ID!" }),
});
export type ExpenseSchema = z.infer<typeof expenseSchema>;

// Expense Type Schema
export const expenseTypeSchema = z.object({
    id: z.string().uuid().optional(),
    name: z
        .string()
        .min(3, { message: "Name must be at least 3 characters long!" })
        .max(50, { message: "Name must be at most 50 characters long!" }),
    description: z
        .string()
        .max(255, { message: "Description must be at most 255 characters long!" })
        .optional()
        .or(z.literal("")), // Allows optional empty string
});

export type ExpenseTypeInputs = z.infer<typeof expenseTypeSchema>;


// Assets Schema
export const assetSchema = z.object({
    id: z.string().uuid().optional(), // Optional UUID for asset ID
    name: z
        .string()
        .min(3, { message: "Name must be at least 3 characters long!" }) // Simple length validation
        .max(50, { message: "Name must be at most 50 characters long!" }),
    amount: z
        .number()
        .positive({ message: "Amount must be a positive number!" }) // Validate positive number
        .max(100000, { message: "Amount must not exceed 100,000!" }), // Limit max value
    qty: z
        .number()
        .int({ message: "Quantity must be an integer!" }) // Ensuring the quantity is an integer
        .min(1, { message: "Quantity must be at least 1!" }), // Minimum value validation
    value: z
        .number()
        .positive({ message: "Value must be a positive number!" }) // Positive number validation
        .max(100000, { message: "Value must not exceed 100,000!" }), // Maximum value check
    purchasedBy: z
        .string()
        .min(3, { message: "Purchaser name must be at least 3 characters long!" }) // Name validation
        .max(50, { message: "Purchaser name must be at most 50 characters long!" }),
    img: z
        .string()
        .url({ message: "Image URL must be valid!" }) // Simple URL validation for image link
        .optional(), // Image is optional
    description: z
        .string()
        .max(255, { message: "Description must not exceed 255 characters!" }) // Adjusted max length to 255 for description
        .optional(), // Optional description
});

export type AssetInputs = z.infer<typeof assetSchema>;








