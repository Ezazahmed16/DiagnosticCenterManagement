import DefaultLayout from "@/components/Layouts/DefaultLayout"
import Table from "@/components/Table"
import { memoData, role } from "@/lib/data"
import Link from "next/link"
import { CgCalendarDue } from "react-icons/cg"
import { FaEdit, FaHistory, FaRegEye, FaUser } from "react-icons/fa"
import { FaMapLocationDot, FaMoneyBillTransfer } from "react-icons/fa6"
import { IoIosCall } from "react-icons/io"
import { MdDeleteOutline, MdPaid } from "react-icons/md"
import { SiGmail } from "react-icons/si"

type memoData = {
    id: number;
    memoId: string;
    patientId: string;
    totalAmount: number;
    status: string;
    issueDate: string;
};

const columns = [
    {
        header: "Memo ID",
        accessor: "memoId",
    },
    {
        header: "Patient Name",
        accessor: "patientId",
    },
    {
        header: "Total Amount",
        accessor: "totalAmount",
    },
    {
        header: "Status",
        accessor: "status",
    },
    {
        header: "Date",
        accessor: "issueDate",
    },
    {
        header: "Actions",
        accessor: "actions",
    },
];

const SinglePatientPage = () => {
    const renderRow = (item: memoData) => {
        return (
            <tr
                key={item.id}
                className="border-b text-sm hover:bg-lamaPurpleLight"
            >
                <td>{item.memoId}</td>
                <td>{item.patientId}</td>
                <td>{item.totalAmount}</td>
                <td>{item.status}</td>
                <td>{item.issueDate}</td>
                <td>
                    <div className="flex items-center justify-start gap-1">
                        <Link href={`/receptionist/all-patients/${item.id}`}>
                            <button className="w-7 h-7 flex items-center justify-center rounded-full">
                                <FaRegEye />
                            </button>
                        </Link>
                        <Link href={`/list/patients/${item.id}/edit`}>
                            <button className="w-7 h-7 flex items-center justify-center rounded-full">
                                <FaEdit />
                            </button>
                        </Link>
                        {/* <Link href={`/list/patients/${item.id}/print`}>
                  <button className="w-7 h-7 flex items-center justify-center rounded-full">
                    <FaPrint />
                  </button>
                </Link> */}
                        {role === "admin" && (
                            <button className="w-8 h-8 flex items-center justify-center rounded-full">
                                <MdDeleteOutline />
                            </button>
                        )}
                    </div>
                </td>
            </tr>
        );
    };
    return (
        <DefaultLayout userRole={role}>
            <div className="flex flex-col gap-4">
                {/* top (User Info Card) */}
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
                <div className="">
                    {/* bottom (User History) */}
                    <div className="card">
                        <h1 className="text-xl font-semibold">History</h1>
                        <div className="flex flex-1 p-4 rounded-xl gap-4 text-white items-center">
                            <div className="flex flex-col p-4 bg-gray-700 justify-center items-start gap-3 w-full">
                                <FaHistory className="h-8 w-8" />
                                <p>History: 03</p>
                            </div>
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
                </div>
            </div>
            {/* All Memos */}
            <div className="p-4">
                <h1 className="text-xl font-semibold">All History List</h1>
                <Table columns={columns} renderRow={renderRow} data={memoData} />
            </div>
        </DefaultLayout>
    )
}

export default SinglePatientPage