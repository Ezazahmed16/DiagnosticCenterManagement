import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Table from "@/components/Table";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import Link from "next/link";
import { FaUser, FaHistory, FaRegEye } from "react-icons/fa";
import { IoIosCall } from "react-icons/io";
import { MdBloodtype, MdPaid } from "react-icons/md";
import { CgCalendarDue } from "react-icons/cg";
import { FaMapLocationDot, FaMoneyBillTransfer } from "react-icons/fa6";
import { role } from "@/lib/data";

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

    // Fetch patient data
    const patient = await prisma.patient.findUnique({
        where: { id: patientId },
    });

    if (!patient) {
        return (
            <DefaultLayout userRole="">
                <div className="text-center p-4">
                    <h1>Patient not found</h1>
                </div>
            </DefaultLayout>
        );
    }

    // Fetch memo data and calculate amounts in a single loop
    const memos = await prisma.memo.findMany({
        where: { patientId },
        select: {
            id: true,
            memoNo: true,
            totalAmount: true,
            paymentMethod: true,
            createdAt: true,
        },
    });

    // Calculate total, due, and paid amounts
    let totalAmount = 0;
    let dueAmount = 0;
    let paidAmount = 0;

    memos.forEach(memo => {
        totalAmount += memo.totalAmount;
        if (memo.paymentMethod === "DUE") {
            dueAmount += memo.totalAmount;
        } else if (memo.paymentMethod === "PAID") {
            paidAmount += memo.totalAmount;
        }
    });

    // Render table row for each memo
    const renderRow = (item: any) => (
        <tr key={item.id} className="border-b text-md">
            <td>{item.memoNo}</td>
            <td>{item.totalAmount}</td>
            <td>
                <p className={`w-min p-2 rounded-full ${item.paymentMethod === "DUE" ? "bg-red-600" : "bg-success"} text-white`}>
                    {item.paymentMethod}
                </p>
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
        <DefaultLayout userRole="">
            <div className="min-h-screen">
                {/* Patient Info */}
                <div className="card flex flex-col gap-4 p-4 rounded-lg">
                    <div className="flex gap-6 items-center">
                        <FaUser size={80} />
                        <div>
                            <h1 className="text-2xl font-semibold">{patient.name}</h1>
                            <p><span className="font-bold">Age: </span>{patient.dateOfBirth}</p>
                            <p><span className="font-bold">Gender:</span> {patient.gender}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-white">
                        <div className="p-4 bg-gray-700 flex gap-3 items-center">
                            <IoIosCall size={36} />
                            <p>{patient.phone}</p>
                        </div>
                        <div className="p-4 bg-gray-700 flex gap-3 items-center">
                            <MdBloodtype size={36} />
                            <p>{patient.bloodType || "Not Provided"}</p>
                        </div>
                        <div className="p-4 bg-gray-700 flex gap-3 items-center">
                            <FaMapLocationDot size={36} />
                            <p>{patient.address || "Not Provided"}</p>
                        </div>
                    </div>
                </div>

                {/* History */}
                <div className="card p-4 rounded-lg mt-4">
                    <h2 className="text-xl font-semibold">Patient History</h2>
                    <div className="grid grid-cols-4 gap-6 mt-4">
                        <div className="p-4 bg-gray-700 text-white text-center rounded-lg flex items-center gap-4">
                            <FaHistory size={32} />
                            <p>History: {memos.length}</p>
                        </div>
                        <div className="p-4 bg-gray-700 text-white text-center rounded-lg flex items-center gap-4">
                            <FaMoneyBillTransfer size={32} />
                            <p>Total Amount: {totalAmount.toFixed(2)}</p>
                        </div>
                        <div className="p-4 bg-gray-700 text-white text-center rounded-lg flex items-center gap-4">
                            <CgCalendarDue size={32} />
                            <p>Due Amount: {dueAmount.toFixed(2)}</p>
                        </div>
                        <div className="p-4 bg-gray-700 text-white text-center rounded-lg flex items-center gap-4">
                            <MdPaid size={32} />
                            <p>Paid: {paidAmount.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Memo Table */}
                <div className="card p-4 rounded-lg mt-4">
                    <h2 className="text-xl font-semibold">All History List</h2>
                    <Table columns={columns} renderRow={renderRow} data={memos} />
                </div>
            </div>
        </DefaultLayout>
    );
}
