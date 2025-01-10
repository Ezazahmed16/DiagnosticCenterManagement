"use server";
import { PaymentMethod } from "@prisma/client";
import { ExpenseSchema, memoSchema, MemoSchema, PatientSchema, PerformedBySchema, TestSchema } from "./FormValidationSchemas";
import prisma from "./prisma";
import { referredBySchema, ReferredBySchema } from "./FormValidationSchemas";

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
        let patientId: string | null = null;

        const existingPatient = await prisma.patient.findUnique({
            where: { phone: validatedData.phone },
        });

        if (existingPatient) {
            // Use the existing patient's ID
            patientId = existingPatient.id;
        } else {
            // Create a new patient and assign their ID
            const newPatient = await prisma.patient.create({
                data: {
                    name: validatedData.name,
                    phone: validatedData.phone ?? "",
                    gender: validatedData.gender,
                    dateOfBirth: validatedData.dateOfBirth,
                    address: validatedData.address,
                },
            });
            patientId = newPatient.id;
        }

        // Step 2: Create the memo
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
                referredById: validatedData.referredBy || undefined,
                // performedById: validatedData.performedBy ?? null,
                patientId: patientId,
            },
        });

        // Step 3: Handle tests and insert into MemoToTest
        if (validatedData.memoTest?.length) {
            if (!memo.id) {
                throw new Error("Memo ID is required for creating memo tests.");
            }

            if (!memo.id) {
                throw new Error("Memo ID is required for creating memo tests.");
            }

            const memoTestData = validatedData.memoTest.map((test) => ({
                memoId: memo.id as string,
                testId: test.id,
                testName: test.testName,
                price: test.price,
                roomNo: test.roomNo || null,
                deliveryTime: test.deliveryTime || null,
                performedById: test.performedById || null,
            }));

            // await prisma.memoToTest.createMany({
            //     data: memoTestData,
            // });
        }

        console.log("Memo and tests successfully created:", memo);
        return { success: true, error: false };
    } catch (error: unknown) {
        console.error("Error creating memo:", error);

        if (error instanceof Error) {
            console.error("Error message:", error.message);
        }

        return { success: false, error: true };
    }
};



// Update a memo
export const updateMemo = async (data: MemoSchema): Promise<{ success: boolean; error: boolean }> => {
    try {
        // Validate the incoming data using the memoSchema
        const validatedData = memoSchema.parse(data);

        // Step 1: Update the memo record
        const updatedMemo = await prisma.memo.update({
            where: { id: validatedData.id },
            data: {
                name: validatedData.name,
                phone: validatedData.phone,
                gender: validatedData.gender,
                dateOfBirth: validatedData.dateOfBirth,
                address: validatedData.address,
                paidAmount: validatedData.paidAmount ?? 0,
                dueAmount: validatedData.dueAmount ?? 0,
                totalAmount: validatedData.totalAmount ?? 0,
                paymentMethod: validatedData.paymentMethod as PaymentMethod ?? "DUE",
                discount: validatedData.discount ?? 0,
                referredById: validatedData.referredBy || undefined,
            },
        });

        // Step 2: Update MemoToTest entries
        if (validatedData.memoTest?.length) {
            // Delete existing memo-to-test entries for this memo
            await prisma.memoToTest.deleteMany({
                where: { memoId: validatedData.id },
            });

            // Create new memo-to-test entries
            const memoTestData = validatedData.memoTest.map((test) => ({
                memoId: validatedData.id,
                testId: test.id,
                testName: test.testName,
                price: test.price,
                roomNo: test.roomNo || null,
                deliveryTime: test.deliveryTime || null,
                performedById: test.performedById || null,
            }));

            await prisma.memoToTest.createMany({
                data: memoTestData,
            });
        }

        console.log("Memo successfully updated:", updatedMemo);
        return { success: true, error: false };
    } catch (error: unknown) {
        console.error("Error updating memo:", error);

        if (error instanceof Error) {
            console.error("Error message:", error.message);
        }

        return { success: false, error: true };
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
        console.log(data)
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
                deliveryTime: data.deliveryTime || null,
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
        await prisma.performedBy.create({
            data: {
                name: data.name,
                phone: data.phone,
                commission: data.commission,
                totalPerformed: data.totalPerformed,
                totalAmount: data.totalAmount,
                payable: data.payable,
                dueAmount: data.dueAmount,
            },
        });
        console.log("Performer created:", data);
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

        // Prepare the data for update
        const updateData: { [key: string]: any } = {};

        if (data.name) updateData.name = data.name;
        if (data.phone) updateData.phone = data.phone;
        if (data.commission !== undefined) updateData.commission = data.commission;
        if (data.totalPerformed !== undefined) updateData.totalPerformed = data.totalPerformed;
        if (data.totalAmount !== undefined) updateData.totalAmount = data.totalAmount;
        if (data.payable !== undefined) updateData.payable = data.payable;
        if (data.dueAmount !== undefined) updateData.dueAmount = data.dueAmount;

        // Perform the update operation
        await prisma.performedBy.update({
            where: { id: data.id },
            data: updateData,
        });

        console.log("Performer updated:", data);
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



// Create a Referral
export const createReferredBy = async (data: ReferredBySchema): Promise<{ success: boolean; error: boolean }> => {
    try {
        // Validate the incoming data
        const validatedData = referredBySchema.parse(data);

        // Create the referral in the database
        await prisma.referredBy.create({
            data: {
                name: validatedData.name,
                phone: validatedData.phone ?? "",
                commissionPercent: validatedData.commissionPercent ?? 0,
            },
        });

        return { success: true, error: false };
    } catch (err) {
        console.error("Error creating referredBy:", err);
        return { success: false, error: true };
    }
};

// Update a Referral
export const updateReferredBy = async (data: ReferredBySchema): Promise<{ success: boolean; error: boolean }> => {
    try {
        if (!data.id) {
            throw new Error("Referral ID is required for update.");
        }

        // Validate the incoming data
        const validatedData = referredBySchema.parse(data);

        // Perform the update operation
        await prisma.referredBy.update({
            where: { id: validatedData.id },
            data: {
                name: validatedData.name,
                phone: validatedData.phone,
                commissionPercent: validatedData.commissionPercent ?? 0,
            },
        });

        return { success: true, error: false };
    } catch (err) {
        console.error("Error updating referredBy:", err);
        return { success: false, error: true };
    }
};

// Delete a Referral
export const deleteReferredBy = async (formData: FormData): Promise<{ success: boolean; error: boolean }> => {
    try {
        const id = formData.get("id") as string;

        if (!id) {
            throw new Error("Referral ID is required for deletion.");
        }

        // Delete the referral from the database
        await prisma.referredBy.delete({
            where: { id },
        });

        return { success: true, error: false };
    } catch (err) {
        console.error("Error deleting referredBy:", err);
        return { success: false, error: true };
    }
};
