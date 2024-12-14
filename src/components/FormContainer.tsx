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
    | "UserData"
    | "ExpenseType"
    | "AssetsData"
    | "ReferalData";
    type: "create" | "update" | "delete";
    data?: any;
    id?: string;
    relatedData?: {
        performers?: { id: string; name: string }[]; 
    }; 
};


const FormContainer = async ({ table, type, data, id }: FormModalProps) => {
    let relatedData: any = {};

    if (type !== "delete") {
        switch (table) {
            case "testData":
                const performedBy = await prisma.performedBy.findMany({
                    select: { id: true, name: true },
                });
                relatedData = { performers: performedBy };
                break;

            default:
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
