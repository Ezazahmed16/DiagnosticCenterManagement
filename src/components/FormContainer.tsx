import prisma from "@/lib/prisma";
import FormModal from "./FormModal";

export type FormModalProps = {
    table:
    | "account"
    | "receptionist"
    | "patientData"
    | "memoData"
    | "testData"
    | "patient"
    | "ExpenseData"
    | "PerformerData"
    | "User Data"
    | "ExpenseType"
    | "AssetsData"
    | "ReferalData";
    type: "create" | "update" | "delete";
    data?: any;
    id?: string;
    relatedData?: {
        performers?: { id: string; name: string }[];
        tests?: { id: string; name: string; price: number }[];
        referral?: { id: string; name: string; }[];
        expenseTypes?: { id: string; name: string; }[];
        performersMemo?: { id: string; name: string; }[];
        PerformerTotalAmount?: {  id: true, price: true, performedById: true, testName: true }[];
    };
};


const FormContainer = async ({ table, type, data, id }: FormModalProps) => {
    let relatedData: any = {};

    if (type !== "delete") {
        switch (table) {
            case "PerformerData":
                const PerformerTotalAmount = await prisma.memoToTest.findMany({
                    select: { id: true, price: true, performedById: true, testName: true, },
                })
                relatedData = { PerformerTotalAmount: PerformerTotalAmount };
                break;
            case "testData":
                const performers = await prisma.performedBy.findMany({
                    select: { id: true, name: true },
                })
                relatedData = { performers: performers };
                break;
            case "ExpenseData":
                const expenseType = await prisma.expenseType.findMany({
                    select: { id: true, name: true },
                })
                relatedData = { expenseTypes: expenseType };
                break;
            case "memoData":
                const tests = await prisma.test.findMany({
                    select: { id: true, name: true, price: true, roomNo: true, deliveryTime: true },
                });
                const referral = await prisma.referredBy.findMany({
                    select: { id: true, name: true },
                });
                const performersMemo = await prisma.performedBy.findMany({
                    select: { id: true, name: true },
                });
                relatedData.tests = tests;
                relatedData.referral = referral;
                relatedData.performers = performersMemo;
                break;
        }
    }

    return (
        <div>
            {/* Passing relatedData to FormModal */}
            <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData} />
        </div>
    );
};

export default FormContainer;
