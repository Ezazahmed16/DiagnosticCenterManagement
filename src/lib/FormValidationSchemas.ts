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
