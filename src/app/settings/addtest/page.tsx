import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { testData, role } from "@/lib/data";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { FaEdit, FaPlus, FaPrint, FaRegEye } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

type testData = {
  id: number;
  testId: string;
  testName: string;
  price: string;
  additionalCost: string;
  totalCost: string
};

const columns = [
  {
    header: "Test ID",
    accessor: "testId",
  },
  {
    header: "Test Name",
    accessor: "testName",
  },
  {
    header: "Ammount",
    accessor: "price",
  },
  {
    header: "Additional Cost",
    accessor: "additionalCost",
  },
  {
    header: "Total Ammount",
    accessor: "totalCost",
  },
  {
    header: "Actions",
    accessor: "actions",
  },
];

const AllTestsPage = () => {
  const renderRow = (item: testData) => {
    return (
      <tr
        key={item.id}
        className="border-b text-sm hover:bg-lamaPurpleLight"
      >
        <td>{item.testId}</td>
        <td>{item.testName}</td>
        <td>{item.price}</td>
        <td>{item.additionalCost}</td>
        <td>{item.totalCost}</td>
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
    <DefaultLayout>
      <div className="min-h-screen">
        {/* Top */}
        <div className="flex justify-between items-center p-4 gap-5">
          <h1 className="text-lg font-semibold">All Test</h1>
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
            <Link
              href="#"
              className="inline-flex items-center justify-center gap-1.5 border border-white bg-primary dark:bg-transparent px-4 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-6 rounded-full"
            >
              <FaPlus className="h-4 w-4" />
              Add
            </Link>
          </div>
        </div>

        {/* Table */}
        <Table columns={columns} renderRow={renderRow} data={testData} />

        {/* Pagination */}
        <Pagination />
      </div>
    </DefaultLayout>
  );
};

export default AllTestsPage;
