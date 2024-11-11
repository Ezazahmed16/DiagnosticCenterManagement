import FormModal from "@/components/FormModal"
import DefaultLayout from "@/components/Layouts/DefaultLayout"
import Table from "@/components/Table"
import { role, testData } from "@/lib/data"
import Link from "next/link"
import { CgCalendarDue } from "react-icons/cg"
import { FaPrint, FaUser } from "react-icons/fa"
import { FaMapLocationDot, FaMoneyBillTransfer } from "react-icons/fa6"
import { IoIosCall } from "react-icons/io"
import { MdPaid } from "react-icons/md"
import { SiGmail } from "react-icons/si"


type testData = {
    id: number;
    testName: string;
    totalCost: string
};

const columns = [
    {
        header: "Test Name",
        accessor: "testName",
    },
    {
        header: "Total Ammount",
        accessor: "totalCost",
    },
];

const SinglePatientPage = () => {
    const renderRow = (item: testData) => {
        return (
            <tr
                key={item.id}
                className="border-b text-sm hover:bg-lamaPurpleLight"
            >
                <td>{item.testName}</td>
                <td>{item.totalCost}</td>
            </tr>
        );
    };
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
                {/* (User Info Card) */}
                <div className="card flex flex-1 p-4 rounded-xl">
                    <div className="w-1/3">
                        <FaUser className="h-20 w-20" />
                        <h1 className="text-xl font-semibold mt-2">Ezaz Ahmed</h1>
                        <p>Age: 37</p>
                        <p>Gender: Male</p>
                    </div>
                    <div className="w-2/3 grid grid-cols-2 gap-4 text-white">
                        <div className="flex flex-col p-4 bg-gray-700 justify-center items-start gap-3">
                            <IoIosCall className="h-8 w-8" />
                            <p>+8801726065822</p>
                        </div>
                        <div className="flex flex-col p-4 bg-gray-700 justify-center items-start gap-3">
                            <SiGmail className="h-8 w-8" />
                            <p>dev.ezazahmed@gmail.com</p>
                        </div>
                        <div className="flex flex-col p-4 bg-gray-700 justify-center items-start gap-3">
                            <FaMapLocationDot className="h-8 w-8" />
                            <p>1B, Test, Dhaka, Bangladesh</p>
                        </div>
                    </div>
                </div>
                {/* Middle (Payment History) */}
                <div className="card">
                    <h1 className="text-xl font-semibold">Payment History</h1>
                    <div className="flex flex-1 p-4 rounded-xl gap-4 text-white items-center">
                        <div className="flex flex-col p-4 bg-gray-700 justify-center items-start gap-3 w-full">
                            <FaMoneyBillTransfer className="h-8 w-8" />
                            <p>Total Ammount: 5,000</p>
                        </div>
                        <div className="flex flex-col p-4 bg-gray-700 justify-center items-start gap-3 w-full">
                            <CgCalendarDue className="h-8 w-8" />
                            <p>Due Ammount: 1,000</p>
                        </div>
                        <div className="flex flex-col p-4 bg-gray-700 justify-center items-start gap-3 w-full">
                            <MdPaid className="h-8 w-8" />
                            <p>Paid: 4,000</p>
                        </div>

                    </div>
                </div>
                {/* Test History */}
                <div className="card flex flex-col gap-4">
                    <h1 className="text-xl font-semibold">Test History</h1>

                    {/* Table */}
                    <Table columns={columns} renderRow={renderRow} data={testData} />
                </div>
            </div>
        </DefaultLayout>
    )
}

export default SinglePatientPage