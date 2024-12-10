import FormModal from "@/components/FormModal";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Table from "@/components/Table";
import { role } from "@/lib/data";
import Link from "next/link";
import { CgCalendarDue } from "react-icons/cg";
import { FaPrint, FaUser } from "react-icons/fa";
import { FaMapLocationDot, FaMoneyBillTransfer } from "react-icons/fa6";
import { IoIosCall } from "react-icons/io";
import { MdPaid } from "react-icons/md";
import prisma from "@/lib/prisma"; // Assuming prisma is used for data fetching

const columns = [
    {
        header: "Test Name",
        accessor: "testName",
    },
    {
        header: "Total Amount",
        accessor: "totalCost",
    },
];

const SingleMemoPage = async ({ params }: { params: { id: string } }) => {
    const memoId = params.id;

    // Fetch the memo data, including patient information (joined query for patient)
    const memo = await prisma.memo.findUnique({
        where: { id: memoId },
        include: {
            Patient: true,
        },
    });

    if (!memo) {
        return (
            <DefaultLayout userRole={role}>
                <div className="text-center p-4">
                    <h1>Memo not found</h1>
                </div>
            </DefaultLayout>
        );
    }

    // Fetch the test data associated with this memo
    const tests = await prisma.test.findMany({
        where: {
            memos: {
                some: {
                    id: memo.id,
                },
            },
        },
        select: {
            id: true,
            name: true,
            price: true,
        },
    });

    // Render table row for each test
    const renderRow = (item: { id: string; name: string; price: number }) => (
        <tr key={item.id} className="border-b text-sm hover:bg-lamaPurpleLight">
            <td>{item.name}</td>
            <td>{item.price}</td>
        </tr>
    );
    return (
        <DefaultLayout userRole={role}>
            <div className="flex flex-col gap-4">
                {/* Top */}
                <div className="flex justify-end items-center p-4 gap-5">
                    <div className="flex justify-center items-center gap-2">
                        <Link
                            href="#"
                            className="inline-flex items-center justify-center gap-1.5 border border-white bg-primary dark:bg-transparent px-4 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-6 rounded-full"
                        >
                            <FormModal table="memoData" type="create" />
                            Add
                        </Link>
                    </div>
                    <div className="flex justify-center items-center gap-2">
                        <Link
                            href="#"
                            className="inline-flex items-center justify-center gap-1.5 border border-white bg-primary dark:bg-transparent px-4 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-6 rounded-full"
                        >
                            <FaPrint className="h-4 w-4" />
                            Print
                        </Link>
                    </div>
                </div>

                {/* Patient Info Card */}
                <div className="card flex flex-1 p-4 rounded-xl">
                    <div className="w-1/3">
                        <FaUser className="h-20 w-20" />
                        <h1 className="text-xl font-semibold mt-2">{memo.Patient?.name}</h1>
                        <p>Age: {memo.Patient?.dateOfBirth ? new Date().getFullYear() - new Date(memo.Patient?.dateOfBirth).getFullYear() : "N/A"}</p>
                        <p>Gender: {memo.Patient?.gender}</p>
                    </div>
                    <div className="w-2/3 grid grid-cols-2 gap-4 text-white">
                        <div className="flex flex-col p-4 bg-gray-700 justify-center items-start gap-3">
                            <IoIosCall className="h-8 w-8" />
                            <p>{memo.Patient?.phone}</p>
                        </div>
                        <div className="flex flex-col p-4 bg-gray-700 justify-center items-start gap-3">
                            <FaMapLocationDot className="h-8 w-8" />
                            <p>{memo.Patient?.address}</p>
                        </div>
                    </div>
                </div>

                {/* Payment History */}
                <div className="card">
                    <h1 className="text-xl font-semibold">Payment History</h1>
                    <div className="flex flex-1 p-4 rounded-xl gap-4 text-white items-center">
                        <div className="flex flex-col p-4 bg-gray-700 justify-center items-start gap-3 w-full">
                            <FaMoneyBillTransfer className="h-8 w-8" />
                            <p>Total Amount: {memo.totalAmount}</p>
                        </div>
                        <div className="flex flex-col p-4 bg-gray-700 justify-center items-start gap-3 w-full">
                            <CgCalendarDue className="h-8 w-8" />
                            <p>Due Amount: {memo.dueAmount}</p>
                        </div>
                        <div className="flex flex-col p-4 bg-gray-700 justify-center items-start gap-3 w-full">
                            <MdPaid className="h-8 w-8" />
                            <p>Paid: {memo.paidAmount}</p>
                        </div>
                    </div>
                </div>

                {/* Test History */}
                <div className="card flex flex-col gap-4">
                    <h1 className="text-xl font-semibold">Test History</h1>

                    {/* Table */}
                    <Table columns={columns} renderRow={renderRow} data={tests} />
                </div>
            </div>
        </DefaultLayout>
    );
};

export default SingleMemoPage;
