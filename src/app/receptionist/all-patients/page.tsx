import FormModal from "@/components/FormModal";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { memoData, patientData, role } from "@/lib/data";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { FaRegEye } from "react-icons/fa";

type patientData = {
  id: number;
  patientId: string;
  name: string;
  email: string;
  status: string;
  memoId: string[];
};

const columns = [
  {
    header: "Patient ID",
    accessor: "patientId",
  },
  {
    header: "Name",
    accessor: "name",
  },
  {
    header: "Email",
    accessor: "email",
  },
  {
    header: "Status",
    accessor: "status",
  },
  {
    header: "Actions",
    accessor: "actions",
  },
];

const AllPatientsPage = () => {
  const renderRow = (item: patientData) => {
    // Determine status based on memos
    const hasDue = item.memoId.some((memoId) => {
      const memo = memoData.find((m) => m.memoId === memoId);
      return memo && memo.due > 0;
    });
    const status = hasDue ? "Due" : "Paid";

    return (
      <tr
        key={item.id}
        className="border-b text-sm hover:bg-lamaPurpleLight"
      >
        <td>{item.patientId}</td>
        <td>{item.name}</td>
        <td>{item.email}</td>
        <td>{status}</td>
        <td>
          <div className="flex items-center justify-start gap-1">
            {/* View Button */}
            <Link href={`/receptionist/all-patients/${item.id}`}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full">
                <FaRegEye size={18} />
              </button>
            </Link>
            {/* Edit Button */}
            <button className="w-7 h-7 flex items-center justify-center rounded-full">
              <FormModal table="patientData" type="update" />
            </button>

            {/* Delete Button (Only visible for admin) */}
            {role === "admin" && (
              <button className="w-8 h-8 flex items-center justify-center rounded-full">
                {/* <FormModal table="patientData" type="delete" /> */}
                <FormModal table="patientData" type="delete" id={item.id} />
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
          <h1 className="text-lg font-semibold">All Patient</h1>
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
            {/* Add Button */}
            <button
              className="inline-flex items-center justify-center gap-1.5 border border-white bg-primary dark:bg-transparent px-4 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-6 rounded-full"
            >
              <FormModal table="patientData" type="create" data="" />
              Add Patient
            </button>
          </div>
        </div>

        {/* Table */}
        <Table columns={columns} renderRow={renderRow} data={patientData} />

        {/* Pagination */}
        <Pagination />
      </div>
    </DefaultLayout>
  );
};

export default AllPatientsPage;
