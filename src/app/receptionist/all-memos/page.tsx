import FormModal from "@/components/FormModal";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { memoData, role } from "@/lib/data";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { FaPrint, FaRegEye } from "react-icons/fa";

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

const AllMemosPage = () => {
  const renderRow = (item: memoData) => {
    return (
      <tr key={item.id} className="border-b text-sm hover:bg-lamaPurpleLight">
        <td>{item.memoId}</td>
        <td>{item.patientId}</td>
        <td>{item.totalAmount}</td>
        <td>{item.status}</td>
        <td>{item.issueDate}</td>
        <td>
          <div className="flex items-center justify-start gap-1">
            <Link href={`/receptionist/all-memos/${item.id}`}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full">
                <FaRegEye size={18} />
              </button>
            </Link>
            <button className="w-7 h-7 flex items-center justify-center rounded-full">
              <FormModal
                table="memoData"
                type="update"
                data={{
                  id: 1,
                  memoId: "5251",
                  patientName: "Ezaz Ahmed",
                  age: 27,
                  phone: "01726065822",
                  gender: "male",
                  email: "ezazrahul794@gmail.com",
                  address: "123 Main St, Dhaka, Bangladesh",
                  memoTest: ["Blood Test", "MRI"],
                  totalAmount: 1500,
                  pay: 1000,
                  dueAmount: 300,
                  status: "Due",
                  issueDate: "2024-11-01",
                  paymentDueDate: "2024-11-10",
                }}
              />
            </button>
            {/* Print Button */}
            <button className="w-7 h-7 flex items-center justify-center rounded-full">
              <FaPrint size={18} />
            </button>
            {role === "admin" && (
              <button className="w-8 h-8 flex items-center justify-center rounded-full">
                <FormModal table="memoData" type="delete" id={item.id} />
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <DefaultLayout userRole={role}>
      <div className="min-h-screen">
        {/* Top Section */}
        <div className="flex justify-between items-center p-4 gap-5">
          <h1 className="text-lg font-semibold">All Memos</h1>
          <div className="flex justify-center items-center gap-2">
            <div className="relative">
              <button className="absolute left-2 top-1/2 -translate-y-1/2">
                <CiSearch className="h-6 w-6" />
              </button>
              <input
                type="text"
                placeholder="Type to search..."
                className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none lg:w-60 border-2 py-2 rounded-3xl"
              />
            </div>
            <button
              className="inline-flex items-center justify-center gap-1.5 border border-white bg-primary dark:bg-transparent px-4 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-6 rounded-full"
            >
              <FormModal table="memoData" type="create" />
              Add
            </button>
          </div>
        </div>

        {/* Table */}
        <Table columns={columns} renderRow={renderRow} data={memoData} />

        {/* Pagination */}
        <Pagination />
      </div>
    </DefaultLayout>
  );
};

export default AllMemosPage;
