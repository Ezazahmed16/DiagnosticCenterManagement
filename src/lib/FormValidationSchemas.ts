import { z } from "zod";

// Patient
export const patientSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(3, { message: "Patient name must be at least 3 characters long!" }),
    phone: z
        .string()
        .min(10, { message: "Phone number must be at least 10 digits long!" }),
    gender: z.enum(["MALE", "FEMALE", "OTHER"], { message: "Gender is required!" }),
    dateOfBirth: z.preprocess(
        (val) => (typeof val === "string" ? new Date(val) : val),
        z.date({
            required_error: "Date of birth is required!",
            invalid_type_error: "Date of birth must be a valid date!",
        })
    ),
    address: z.string().optional(),
    bloodType: z.string().optional(),
});

export type PatientSchema = z.infer<typeof patientSchema>;


// Memo
export const memoSchema = z.object({
  id: z.string().uuid().optional(),  
  name: z.string().min(3, { message: "Patient name must be at least 3 characters long!" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits long!" }),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], { message: "Gender is required!" }),
  dateOfBirth: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date({
      required_error: "Date of birth is required!",
      invalid_type_error: "Date of birth must be a valid date!",
    })
  ),
  address: z.string().optional(),
  referredBy: z.string().optional(), 
  referredById: z.string().nullable().optional(), 
  memoTest: z.array(
    z.object({
      id: z.string().uuid({ message: "Test ID must be a valid UUID!" }),
      name: z.string().min(3, { message: "Test name must be at least 3 characters long!" }),
      price: z.number().positive({ message: "Price must be a positive number!" }), 
      roomNo: z.string().optional(),  
    })
  ).optional(),

  paidAmount: z.number().positive({ message: "Paid amount must be a positive number!" }).optional(),
  dueAmount: z.number().nonnegative({ message: "Due amount must be zero or a positive number!" }).optional(),
  totalAmount: z.number().positive({ message: "Total amount must be a positive number!" }).optional(),
  discount: z.number().nonnegative({ message: "Discount must be a non-negative number!" }).optional(),
  
  paymentMethod: z.enum(["PAID", "DUE", "PENDING"]).optional(),  // Optional payment method

  performedBy: z.string().uuid({ message: "Performed by must be a valid UUID!" }).optional(),  // UUID for performedBy
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
        .min(10, { message: "Phone number must be at least 10 digits long!" })
        .optional(),
    testId: z.string().uuid().optional(),
});

export type PerformedBySchema = z.infer<typeof performedBySchema>;

// Expense Type
export const expenseSchema = z.object({
    id: z.string().uuid().optional(), // Optional for create, required for update
    title: z
        .string()
        .min(3, { message: "Title must be at least 3 characters long!" })
        .max(50, { message: "Title must be at most 50 characters long!" }),
    description: z
        .string()
        .max(100, { message: "Description must not exceed 100 characters!" })
        .optional(),
    amount: z
        .preprocess(
            (val) => (typeof val === "string" && val.trim() !== "" ? Number(val) : undefined),
            z.number({ invalid_type_error: "Amount must be a valid number!" })
        )
        .refine((val) => val >= 1, { message: "Amount must be at least 1!" })
        .refine((val) => val <= 100000, { message: "Amount must not exceed 100,000!" }),
    expenseTypeId: z
    .string()
    .uuid({ message: "Expense Type is required!" }).optional(),   
});

export type ExpenseSchema = z.infer<typeof expenseSchema>;


// Referral
export const referredBySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, { message: "Referral name is required and cannot be empty." }),
  phone: z.string().optional(),
  commissionPercent: z.number().min(0, { message: "Commission percent must be a non-negative number." }).optional(),
});

export type ReferredBySchema = z.infer<typeof referredBySchema>;


