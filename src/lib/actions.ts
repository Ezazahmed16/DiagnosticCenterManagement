"use server";
import { MemoSchema, PatientSchema, PerformedBySchema, TestSchema } from "./FormValidationSchemas";
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


// Create a Memo

export const createMemo = async (data: MemoSchema): Promise<{ success: boolean; error: boolean }> => {
    try {
        let patientId: string;

        // Check if the patient exists based on the provided phone or other identifying field
        const existingPatient = await prisma.patient.findUnique({
            where: {
                phone: data.phone, // Assuming phone number is unique
            },
        });

        if (existingPatient) {
            // If patient exists, use the existing patient's ID
            patientId = existingPatient.id;
        } else {
            // If patient doesn't exist, create the patient
            const newPatient = await prisma.patient.create({
                data: {
                    name: data.name,
                    phone: data.phone,
                    gender: data.gender,
                    dateOfBirth: data.dateOfBirth,
                    address: data.address,
                    bloodType: data.bloodType,
                },
            });
            patientId = newPatient.id; // Save the newly created patient's ID
        }

        // Now, create the memo associated with the patient
        await prisma.memo.create({
            data: {
                patientId,  // Associate the created or existing patient's ID
                referredById: data.referredBy,  // Assuming referredBy is a string
                performedById: data.performedBy,
                paymentMethod: data.paymentMethod || 'DUE',
                dueAmount: data.dueAmount || 0,
                paidAmount: data.paidAmount || 0,
                totalAmount: data.totalAmount || 0,
                tests: {
                    connect: data.memoTest?.map((id) => ({ id })),
                },
            },
        });

        // Return success status
        return { success: true, error: false };
    } catch (err) {
        console.error("Error creating memo:", err);
        return { success: false, error: true };
    }
};
// Update a Memo

export const UpdateMemo = async (data: MemoSchema): Promise<{ success: boolean; error: boolean }> => {
    try {
        let patientId: string;

        // Check if the patient exists based on the provided phone or other identifying field
        const existingPatient = await prisma.patient.findUnique({
            where: {
                phone: data.phone, // Assuming phone number is unique
            },
        });

        if (existingPatient) {
            // If patient exists, use the existing patient's ID
            patientId = existingPatient.id;
        } else {
            // If patient doesn't exist, create the patient
            const newPatient = await prisma.patient.create({
                data: {
                    name: data.name,
                    phone: data.phone,
                    gender: data.gender,
                    dateOfBirth: data.dateOfBirth,
                    address: data.address,
                    bloodType: data.bloodType,
                },
            });
            patientId = newPatient.id; // Save the newly created patient's ID
        }

        // Now, create the memo associated with the patient
        await prisma.memo.create({
            data: {
                patientId,  // Associate the created or existing patient's ID
                referredById: data.referredBy,  // Assuming referredBy is a string
                performedById: data.performedBy,
                paymentMethod: data.paymentMethod || 'DUE',
                dueAmount: data.dueAmount || 0,
                paidAmount: data.paidAmount || 0,
                totalAmount: data.totalAmount || 0,
                tests: {
                    connect: data.memoTest?.map((id) => ({ id })),
                },
            },
        });

        // Return success status
        return { success: true, error: false };
    } catch (err) {
        console.error("Error creating memo:", err);
        return { success: false, error: true };
    }
};
// Delete a Memo

// Example of a delete function that expects FormData
export const deleteMemo = async (formData: FormData): Promise<{ success: boolean; error: boolean }> => {
    const id = formData.get("id");
    if (!id) {
        return { success: false, error: true };
    }

    try {
        // Call Prisma to delete the record
        await prisma.memo.delete({
            where: { id: String(id) },  // Ensure the id is cast to string if needed
        });
        return { success: true, error: false };
    } catch (err) {
        console.error(err);
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