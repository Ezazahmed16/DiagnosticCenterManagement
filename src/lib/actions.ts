"use server";
import { PaymentMethod } from "@prisma/client";
import { AssetInputs, assetSchema, ExpenseSchema, ExpenseTypeInputs, expenseTypeSchema, memoSchema, MemoSchema, PatientSchema, PerformedBySchema, TestSchema } from "./FormValidationSchemas";
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

            await prisma.memoToTest.createMany({
                data: memoTestData,
            });
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

        // Fetch the existing performer data
        const existingPerformer = await prisma.performedBy.findUnique({
            where: { id: data.id },
        });

        if (!existingPerformer) {
            throw new Error("Performer not found.");
        }

        // Calculate cumulative paidAmounts
        const updatedPaidAmounts = (existingPerformer.paidAmounts ?? 0) + (data.paidAmounts ?? 0);

        // Prepare the data for update
        const updateData: { [key: string]: any } = {
            name: data.name ?? existingPerformer.name,
            phone: data.phone ?? existingPerformer.phone,
            commission: data.commission ?? existingPerformer.commission,
            totalPerformed: data.totalPerformed ?? existingPerformer.totalPerformed,
            totalAmount: data.totalAmount ?? existingPerformer.totalAmount,
            payable: data.payable ?? existingPerformer.payable,
            dueAmount: data.dueAmount ?? existingPerformer.dueAmount,
            paidAmounts: updatedPaidAmounts,
        };

        // Perform the update operation
        const updatedPerformer = await prisma.performedBy.update({
            where: { id: data.id },
            data: updateData,
        });

        console.log("Performer updated successfully:", updatedPerformer);
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
        await prisma.expense.create({
            data: {
                title: data.title,
                description: data.description || "",
                amount: data.amount,
                expenseTypeId: data.expenseTypeId,
            },
        });
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
export const deleteExpense = async (formData: FormData) => {
    const id = formData.get("id") as string;

    if (!id) {
        return { success: false, error: true };
    }

    try {
        await prisma.expense.delete({
            where: { id },
        });
        return { success: true, error: false };
    } catch (error) {
        console.error(error);
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

        // Fetch the existing referral data
        const existingReferral = await prisma.referredBy.findUnique({
            where: { id: validatedData.id },
        });

        if (!existingReferral) {
            throw new Error("Referral not found.");
        }

        // Prepare update data
        const updateData: { [key: string]: any } = {
            name: validatedData.name ?? existingReferral.name,
            phone: validatedData.phone ?? existingReferral.phone,
            commissionPercent: validatedData.commissionPercent ?? existingReferral.commissionPercent,
        };

        // Perform the update operation
        const updatedReferral = await prisma.referredBy.update({
            where: { id: validatedData.id },
            data: updateData,
        });

        // Handle referral payments if provided
        if (validatedData.payments && validatedData.payments.length > 0) {
            const paymentPromises = validatedData.payments.map(payment => {
                if (!validatedData.id) {
                    throw new Error("ReferredBy ID is required for creating referral payments.");
                }
                return prisma.referralPayment.create({
                    data: {
                        referredById: validatedData.id,
                        amount: payment.amount,
                        date: payment.date,
                    },
                });
            });

            await Promise.all(paymentPromises);
        }

        console.log("Referral updated successfully:", updatedReferral);
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

// Create an ExpenseType
export const createExpenseType = async (
    data: ExpenseTypeInputs
): Promise<{ success: boolean; error: boolean }> => {
    try {
        // Validate the incoming data
        const validatedData = expenseTypeSchema.parse(data);

        // Create the expense type in the database
        await prisma.expenseType.create({
            data: {
                name: validatedData.name,
                description: validatedData.description
            },
        });

        return { success: true, error: false };
    } catch (err) {
        console.error('Error creating ExpenseType:', err);
        return { success: false, error: true };
    }
};

// Update an ExpenseType
export const updateExpenseType = async (
    data: ExpenseTypeInputs & { id: string }
): Promise<{ success: boolean; error: boolean }> => {
    try {
        if (!data.id) {
            throw new Error('ExpenseType ID is required for update.');
        }

        // Validate the incoming data
        const validatedData = expenseTypeSchema.parse(data);

        // Fetch the existing ExpenseType
        const existingExpenseType = await prisma.expenseType.findUnique({
            where: { id: validatedData.id },
        });

        if (!existingExpenseType) {
            throw new Error('ExpenseType not found.');
        }

        // Prepare update data
        const updateData = {
            name: validatedData.name ?? existingExpenseType.name,
            description: validatedData.description ?? existingExpenseType.description,
            updatedAt: new Date(),
        };

        // Perform the update operation
        await prisma.expenseType.update({
            where: { id: validatedData.id },
            data: updateData,
        });

        return { success: true, error: false };
    } catch (err) {
        console.error('Error updating ExpenseType:', err);
        return { success: false, error: true };
    }
};

// Delete an ExpenseType
export const deleteExpenseType = async (
    formData: FormData
): Promise<{ success: boolean; error: boolean }> => {
    try {
        const id = formData.get('id') as string;

        if (!id) {
            throw new Error('ExpenseType ID is required for deletion.');
        }

        // Delete the ExpenseType from the database
        await prisma.expenseType.delete({
            where: { id },
        });

        return { success: true, error: false };
    } catch (err) {
        console.error('Error deleting ExpenseType:', err);
        return { success: false, error: true };
    }
};


// Create an Asset
export const createAsset = async (
    data: AssetInputs
): Promise<{ success: boolean; error: boolean }> => {
    try {
        // Validate the incoming data
        const validatedData = assetSchema.parse(data);

        // Create the asset in the database
        await prisma.asset.create({
            data: {
                name: validatedData.name,
                amount: validatedData.amount,
                qty: validatedData.qty,
                value: validatedData.value,
                purchasedBy: validatedData.purchasedBy,
                description: validatedData.description,
                img: validatedData.img,
            },
        });

        return { success: true, error: false };
    } catch (err) {
        console.error('Error creating Asset:', err);
        return { success: false, error: true };
    }
};

// Update an Asset
export const updateAsset = async (
    data: AssetInputs & { id: string }
): Promise<{ success: boolean; error: boolean }> => {
    try {
        if (!data.id) {
            throw new Error('Asset ID is required for update.');
        }

        // Validate the incoming data
        const validatedData = assetSchema.parse(data);

        // Fetch the existing Asset
        const existingAsset = await prisma.asset.findUnique({
            where: { id: validatedData.id },
        });

        if (!existingAsset) {
            throw new Error('Asset not found.');
        }

        // Prepare update data
        const updateData = {
            name: validatedData.name ?? existingAsset.name,
            amount: validatedData.amount ?? existingAsset.amount,
            qty: validatedData.qty ?? existingAsset.qty,
            value: validatedData.value ?? existingAsset.value,
            purchasedBy: validatedData.purchasedBy ?? existingAsset.purchasedBy,
            description: validatedData.description ?? existingAsset.description,
            updatedAt: new Date(),
            img: validatedData.img,
        };

        // Perform the update operation
        await prisma.asset.update({
            where: { id: validatedData.id },
            data: updateData,
        });

        return { success: true, error: false };
    } catch (err) {
        console.error('Error updating Asset:', err);
        return { success: false, error: true };
    }
};

// Delete an Asset
export const deleteAsset = async (
    formData: FormData
): Promise<{ success: boolean; error: boolean }> => {
    try {
        const id = formData.get('id') as string;

        if (!id) {
            throw new Error('Asset ID is required for deletion.');
        }

        // Delete the Asset from the database
        await prisma.asset.delete({
            where: { id },
        });

        return { success: true, error: false };
    } catch (err) {
        console.error('Error deleting Asset:', err);
        return { success: false, error: true };
    }
};


