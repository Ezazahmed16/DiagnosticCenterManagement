import { ReferredBy } from '@prisma/client';
import { z } from "zod";

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


export const memoSchema = z.object({
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

    paidAmount: z
        .preprocess((val) => (val !== null && val !== "" ? Number(val) : undefined), z.number())
        .optional(),
    dueAmount: z.number().optional(),
    memoTest: z.array(z.string()).optional(),
    referredBy: z.string().optional(),

});
export type MemoSchema = z.infer<typeof memoSchema>;




export const testSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(3, { message: "Test name must be at least 3 characters long!" }),
    description: z.string().optional(),
    testCost: z.number().nonnegative({ message: "Test cost must be non-negative!" }),
    additionalCost: z.number().nonnegative({ message: "Additional cost must be non-negative!" }),
    price: z.number().positive({ message: "Price must be a positive number!" }),
    roomNo: z.string().max(10, { message: "Room number cannot exceed 10 characters!" }).optional(),
    PerformedBy: z.string().optional() || "",
  });
  
  export type TestSchema = z.infer<typeof testSchema>;


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

