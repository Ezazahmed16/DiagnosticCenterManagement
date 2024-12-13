"use server";

import { revalidatePath } from "next/cache";
import { PatientSchema } from "./FormValidationSchemas";
import prisma from "./prisma";

// Patient Create 
export const createPatient = async (data: PatientSchema): Promise<{ success: boolean; error: boolean }> => {
    try {
        // Create the patient in the database
        await prisma.patient.create({
            data: data,
        });
        // revalidatePath("/receptionist/all-patients");
        return { success: true, error: false };
    } catch (err) {
        console.error("Error creating patient:", err);

        // Return failure status
        return { success: false, error: true };
    }
};
// Patient Update 
export const updatePatient = async (data: PatientSchema): Promise<{ success: boolean; error: boolean }> => {
    try {
        // Perform the update operation
        await prisma.patient.update({
            where: { id: data.id },
            data: {
                name: data.name,
                phone: data.phone,
                bloodType: data.bloodType,
                dateOfBirth: data.dateOfBirth,
                gender: data.gender,
                address: data.address,
            },
        });

        // Return success
        return { success: true, error: false };
    } catch (err) {
        console.error("Error updating patient:", err);
        // Return failure status
        return { success: false, error: true };
    }
};

// Patient Delete
export const deletePatient = async (data: FormData): Promise<{ success: boolean; error: boolean }> => {
    try {
        const id = data.get("id") as string
        // Create the patient in the database
        await prisma.patient.delete({
            where: {id:id}
        });
        // revalidatePath("/receptionist/all-patients");
        return { success: true, error: false };
    } catch (err) {
        console.error("Error creating patient:", err);

        // Return failure status
        return { success: false, error: true };
    }
};