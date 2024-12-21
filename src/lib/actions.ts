"use server";
import { PaymentMethod } from "@prisma/client";
import { ExpenseSchema, memoSchema, MemoSchema, PatientSchema, PerformedBySchema, TestSchema } from "./FormValidationSchemas";
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
        // Validate the incoming data using the memoSchema
        const validatedData = memoSchema.parse(data);

        // Step 1: Check if a patient already exists with the provided phone number
        let patientId = null;

        const existingPatient = await prisma.patient.findUnique({
            where: { phone: validatedData.phone },
        });

        if (existingPatient) {
            // If the patient exists, use their id
            patientId = existingPatient.id;
        } else {
            // If the patient does not exist, create a new patient and use the newly created patientId
            const newPatient = await prisma.patient.create({
                data: {
                    name: validatedData.name,
                    phone: validatedData.phone,
                    gender: validatedData.gender,
                    dateOfBirth: validatedData.dateOfBirth,
                    address: validatedData.address,
                },
            });
            patientId = newPatient.id; // Assign the new patient's ID
        }

        // Step 2: Create the memo with the validated data
        const memo = await prisma.memo.create({
            data: {
                name: validatedData.name,
                phone: validatedData.phone,
                gender: validatedData.gender,
                dateOfBirth: validatedData.dateOfBirth,
                address: validatedData.address,
                paymentMethod: validatedData.paymentMethod as PaymentMethod ?? "DUE",
                paidAmount: validatedData.paidAmount ?? 0,
                dueAmount: validatedData.dueAmount ?? 0,
                totalAmount: validatedData.totalAmount ?? 0,
                discount: validatedData.discount ?? 0,
                referredById: validatedData.referredBy, // Connect referredBy if provided

                performedById: validatedData.performedBy ?? null,

                // Assign the patientId to the memo
                patientId: patientId,

                // Handle tests: ensure proper format for memoTest
                tests: validatedData.memoTest
                    ? {
                        connect: validatedData.memoTest.map((test) => ({
                            id: test.id,
                        })),
                    }
                    : undefined,
            },
        });

        console.log("Memo Created:", memo); // Check the created memo
        return { success: true, error: false };
    } catch (error: unknown) {
        console.error("Error creating memo:", error);

        // Handle the error based on its type
        if (error instanceof Error) {
            console.error("Error message:", error.message);
        }

        return { success: false, error: true };
    }
};
// Update a memo
export const updateMemo = async (data: MemoSchema) => {
    try {
        const updatedMemo = await prisma.memo.update({
            where: { id: data.id },
            data: {
                name: data.name,
                phone: data.phone,
                gender: data.gender,
                dateOfBirth: data.dateOfBirth,
                address: data.address,
                paidAmount: data.paidAmount,
                dueAmount: data.dueAmount,
                totalAmount: data.totalAmount,
                paymentMethod: data.paymentMethod as PaymentMethod ?? "DUE", discount: data.discount,
                referredById: data.referredBy,
                performedById: data.performedBy ?? null,
                tests: data.memoTest
                    ? {
                        connect: data.memoTest.map((test) => ({
                            id: test.id,
                        })),
                    }
                    : undefined,
            },
        });
        return updatedMemo; // Return updated memo if needed
    } catch (error) {
        console.error("Error updating memo:", error);
        throw new Error("Failed to update memo");
    }
};
// Delete a Memo

export const deleteMemo = async (formData: FormData): Promise<{ success: boolean; error: boolean }> => {
    try {
        const id = formData.get("id") as string;

        if (!id) {
            throw new Error("Memo ID is required for deletion.");
        }

        // Delete the memo from the database
        await prisma.memo.delete({
            where: { id },
        });

        console.log("Memo deleted:", id);
        return { success: true, error: false };
    } catch (err) {
        console.error("Error deleting memo:", err);
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

// Expense Create
export const createExpense = async (data: ExpenseSchema): Promise<{ success: boolean; error: boolean }> => {
    try {
        // await prisma.expense.create({
        //     data: {
        //         title: data.title,
        //         description: data.description || "", 
        //         amount: data.amount,
        //         expenseTypeId: data.expenseTypeId,
        //     },
        // });
        return { success: true, error: false };
    } catch (err) {
        console.error("Error creating expense:", err);
        return { success: false, error: true };
    }
};

// Expense Update
export const updateExpense = async (data: ExpenseSchema): Promise<{ success: boolean; error: boolean }> => {
    try {
        if (!data.id) {
            throw new Error("Expense ID is required for update.");
        }

        // Perform the update operation
        await prisma.expense.update({
            where: { id: data.id },
            data: {
                title: data.title,
                description: data.description || "", // Default to an empty string if null
                amount: data.amount,
                expenseTypeId: data.expenseTypeId,
            },
        });
        return { success: true, error: false };
    } catch (err) {
        console.error("Error updating expense:", err);
        return { success: false, error: true };
    }
};

// Expense Delete
export const deleteExpense = async (id: string): Promise<{ success: boolean; error: boolean }> => {
    try {
        if (!id) {
            throw new Error("Expense ID is required for deletion.");
        }

        // Delete the expense from the database
        await prisma.expense.delete({
            where: { id },
        });
        return { success: true, error: false };
    } catch (err) {
        console.error("Error deleting expense:", err);
        return { success: false, error: true };
    }
};