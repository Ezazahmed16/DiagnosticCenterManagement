import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Table from "@/components/Table";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import Link from "next/link";
import {
    FaUser,
    FaHistory,
    FaRegEye,
} from "react-icons/fa";
import { IoIosCall } from "react-icons/io";
import { MdPaid } from "react-icons/md";
import { CgCalendarDue } from "react-icons/cg";
import { FaMapLocationDot, FaMoneyBillTransfer } from "react-icons/fa6";

// Define the columns for the table
const columns = [
    { header: "Memo ID", accessor: "id" },
    { header: "Total Amount", accessor: "totalAmount" },
    { header: "Payment Method", accessor: "paymentMethod" },
    { header: "Date", accessor: "issueDate" },
    { header: "Actions", accessor: "actions" },
];

export default async function SinglePatientPage({ params }: { params: { id: string } }) {
    const patientId = params.id;

    const patient = await prisma.patient.findUnique({
        where: { id: patientId },
    });

    if (!patient) {
        return (
            <DefaultLayout userRole="receptionist">
                <div className="text-center p-4">
                    <h1>Patient not found</h1>
                </div>
            </DefaultLayout>
        );
    }

    const memos = await prisma.memo.findMany({
        where: { patientId },
        select: {
            id: true,
            totalAmount: true,
            paymentMethod: true,
            createdAt: true,
        },
    });

    const totalAmount = memos.reduce((acc, memo) => acc + memo.totalAmount, 0);
    const dueAmount = memos
        .filter((memo) => memo.paymentMethod === "DUE")
        .reduce((acc, memo) => acc + memo.totalAmount, 0);
    const paidAmount = memos
        .filter((memo) => memo.paymentMethod === "PAID")
        .reduce((acc, memo) => acc + memo.totalAmount, 0);

    const renderRow = (item: any) => (
        <tr key={item.id} className="border-b text-md">
            <td>{item.id}</td>
            <td>{item.totalAmount}</td>
            <td>
                {
                item.paymentMethod === "DUE" ?
                <p className="bg-red-600 text-white w-min p-2 rounded-full">{item.paymentMethod}</p> :
                <p className="bg-success text-white w-min p-2 rounded-full">{item.paymentMethod}</p>
                }
            </td>
            <td>{format(new Date(item.createdAt), "MMMM dd, yyyy")}</td>
            <td>
                <div className="flex items-center gap-2">
                    <Link href={`/receptionist/all-memos/${item.id}`}>
                        <button className="w-7 h-7 flex items-center justify-center rounded-full">
                            <FaRegEye size={18} />
                        </button>
                    </Link>
                </div>
            </td>
        </tr>
    );

    return (
        <DefaultLayout userRole="receptionist">
            {/* Patient Info */}
            <div className="card flex flex-col gap-4 p-4 rounded-lg">
                <div className="flex gap-6 items-center">
                    <FaUser size={80} />
                    <div>
                        <h1 className="text-2xl font-semibold">{patient.name}</h1>
                        <p>
                            <span className="font-bold">Date of Birth:</span>
                            {format(new Date(patient.dateOfBirth), "MMMM dd, yyyy")}</p>
                        <p>
                            <span className="font-bold">Gender: </span>
                            {patient.gender}</p>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-white">
                    <div className="p-4 bg-gray-700 flex gap-3 items-center">
                        <IoIosCall size={24} />
                        <p>{patient.phone}</p>
                    </div>
                    <div className="p-4 bg-gray-700 flex gap-3 items-center">
                        <FaMapLocationDot size={24} />
                        <p>{patient.bloodType || "Not Provided"}</p>
                    </div>
                    <div className="p-4 bg-gray-700 flex gap-3 items-center">
                        <FaMapLocationDot size={24} />
                        <p>{patient.address || "Not Provided"}</p>
                    </div>
                </div>
            </div>

            {/* History */}
            <div className="card p-4 rounded-lg mt-4">
                <h2 className="text-xl font-semibold">Patient History</h2>
                <div className="grid grid-cols-4 gap-6 mt-4">
                    <div className="p-4 bg-gray-700 text-white text-center rounded-lg">
                        <FaHistory size={24} />
                        <p>History: {memos.length}</p>
                    </div>
                    <div className="p-4 bg-gray-700 text-white text-center rounded-lg">
                        <FaMoneyBillTransfer size={24} />
                        <p>Total Amount: {totalAmount.toFixed(2)}</p>
                    </div>
                    <div className="p-4 bg-gray-700 text-white text-center rounded-lg">
                        <CgCalendarDue size={24} />
                        <p>Due Amount: {dueAmount.toFixed(2)}</p>
                    </div>
                    <div className="p-4 bg-gray-700 text-white text-center rounded-lg">
                        <MdPaid size={24} />
                        <p>Paid: {paidAmount.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Memo Table */}
            <div className="card p-4 rounded-lg mt-4">
                <h2 className="text-xl font-semibold">All History List</h2>
                <Table columns={columns} renderRow={renderRow} data={memos} />
            </div>
        </DefaultLayout>
    );
}
