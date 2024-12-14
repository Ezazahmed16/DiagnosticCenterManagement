"use server";
import { PatientSchema, PerformedBySchema, TestSchema } from "./FormValidationSchemas";
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
            where: { id: id }
        });
        // revalidatePath("/receptionist/all-patients");
        return { success: true, error: false };
    } catch (err) {
        console.error("Error creating patient:", err);

        // Return failure status
        return { success: false, error: true };
    }
};




// Create a Test
export const createTest = async (data: TestSchema): Promise<{ success: boolean; error: boolean }> => {
    try {
        // Create the test in the database
        await prisma.test.create({
            data: {
                name: data.name,
                description: data.description || null,
                testCost: data.testCost,
                additionalCost: data.additionalCost,
                price: data.price,
                roomNo: data.roomNo || null,
                PerformedBy: data.PerformedBy ? { connect: { id: data.PerformedBy } } : undefined,
            },
        });
        // Revalidate the cache (adjust path as necessary)
        // revalidatePath("/tests");
        return { success: true, error: false };
    } catch (err) {
        console.error("Error creating test:", err);
        return { success: false, error: true };
    }
};


// Update a Test
export const updateTest = async (data: TestSchema): Promise<{ success: boolean; error: boolean }> => {
    try {
        if (!data.id) {
            throw new Error("Test ID is required for update.");
        }
        // Perform the update operation
        await prisma.test.update({
            where: { id: data.id },
            data: {
                name: data.name,
                description: data.description || null,
                testCost: data.testCost,
                additionalCost: data.additionalCost,
                price: data.price,
                roomNo: data.roomNo || null,
                PerformedBy: data.PerformedBy ? { connect: { id: data.PerformedBy } } : undefined,
            },
        });
        // Revalidate the cache (adjust path as necessary)
        // revalidatePath("/tests");
        return { success: true, error: false };
    } catch (err) {
        console.error("Error updating test:", err);
        return { success: false, error: true };
    }
};

// Delete a Test
export const deleteTest = async (formData: FormData): Promise<{ success: boolean; error: boolean }> => {
    try {
        const id = formData.get("id") as string;

        // Delete the test from the database
        await prisma.test.delete({
            where: { id },
        });

        return { success: true, error: false };
    } catch (err) {
        console.error("Error deleting test:", err);
        return { success: false, error: true };
    }
};



// Create a Performer
export const createPerformedBy = async (
    data: PerformedBySchema
): Promise<{ success: boolean; error: boolean }> => {
    try {
        // Create the performer in the database
        await prisma.performedBy.create({
            data: {
                name: data.name,
                phone: data.phone,
            },
        });

        console.log("Performer created:", data);
        // Revalidate the cache (adjust path as necessary)
        // revalidatePath("/settings/all-performers");
        return { success: true, error: false };
    } catch (err) {
        console.error("Error creating performer:", err);
        return { success: false, error: true };
    }
};

// Update a Performer
export const updatePerformedBy = async (
    data: PerformedBySchema
): Promise<{ success: boolean; error: boolean }> => {
    try {
        if (!data.id) {
            throw new Error("Performer ID is required for update.");
        }

        // Perform the update operation
        await prisma.performedBy.update({
            where: { id: data.id },
            data: {
                name: data.name,
                phone: data.phone,
            },
        });

        console.log("Performer updated:", data);
        // Revalidate the cache (adjust path as necessary)
        // revalidatePath("/settings/all-performers");
        return { success: true, error: false };
    } catch (err) {
        console.error("Error updating performer:", err);
        return { success: false, error: true };
    }
};

// Delete a Performer
export const deletePerformedBy = async (
    formData: FormData
): Promise<{ success: boolean; error: boolean }> => {
    try {
        const id = formData.get("id") as string;
        if (!id) {
            throw new Error("Performer ID is required for deletion.");
        }

        // Delete the performer from the database
        await prisma.performedBy.delete({
            where: { id },
        });

        console.log("Performer deleted:", id);
        // Revalidate the cache (adjust path as necessary)
        // revalidatePath("/settings/all-performers");
        return { success: true, error: false };
    } catch (err) {
        console.error("Error deleting performer:", err);
        return { success: false, error: true };
    }
};