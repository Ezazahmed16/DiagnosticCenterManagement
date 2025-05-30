import React from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Table from "@/components/Table";
import { role } from "@/lib/data";
import { CgCalendarDue } from "react-icons/cg";
import { FaPrint, FaUser } from "react-icons/fa";
import { FaMapLocationDot, FaMoneyBillTransfer } from "react-icons/fa6";
import { IoIosCall } from "react-icons/io";
import { MdPaid } from "react-icons/md";
import prisma from "@/lib/prisma"; 

const columns = [
    {
        header: "Test Name",
        accessor: "name",
    },
    {
        header: "Total Amount",
        accessor: "price",
    },
];

const SingleMemoPage = async ({ params }: { params: { id: string } }) => {
    const memoId = params.id;

    // Fetch the memo data, including patient information and related tests
    const memo = await prisma.memo.findUnique({
        where: { id: memoId },
        include: {
            Patient: true,
            MemoToTest: true,
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

    // Render table row for each test
    const renderRow = (item: { id: string; testName: string; price: number }) => (
        <tr key={item.id} className="border-b text-sm hover:bg-lamaPurpleLight">
            <td>{item.testName}</td>
            <td>{item.price}</td>
        </tr>
    );


    return (
        <DefaultLayout userRole={role}>
            <div className="flex flex-col gap-4">
                <div>
                    {/* Patient Info */}
                    <div className="card flex flex-1 p-4 rounded-xl">
                        <div className="w-1/3">
                            <FaUser className="h-20 w-20" />
                            <h1 className="text-xl font-semibold mt-2">{memo.Patient?.name}</h1>
                            <p>
                                Age:{" "}
                                {memo.Patient?.dateOfBirth}
                            </p>
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
                    <div className="card flex flex-col gap-4 min-h-screen">
                        <h1 className="text-xl font-semibold">Test History</h1>
                        <Table columns={columns} renderRow={renderRow} data={memo.MemoToTest} />
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default SingleMemoPage;
