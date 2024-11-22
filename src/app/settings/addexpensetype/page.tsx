import FormModal from "@/components/FormModal";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { CiSearch } from "react-icons/ci";
import { FaRegEye } from "react-icons/fa";
import Link from "next/link";
import { role, expensesType } from "@/lib/data";

type ExpenseType = {
  expenseTypeId: number;
  expenseTypeTitle: string;
};

const columns = [
  {
    header: "Expense ID",
    accessor: "expenseTypeId",
  },
  {
    header: "Expense Type",
    accessor: "expenseTypeTitle",
  },
  {
    header: "Actions",
    accessor: "actions",
  },
];


const AllExpenseTypePage = () => {
  const renderRow = (item: ExpenseType) => {
    return (
      <tr
        key={item.expenseTypeId}
        className="border-b text-sm hover:bg-lamaPurpleLight"
      >
        <td>{item.expenseTypeId}</td>
        <td>{item.expenseTypeTitle}</td>
        <td>
          <div className="flex items-center justify-start gap-2">
            {/* View Action */}
            <Link href={`/receptionist/all-patients/${item.expenseTypeId}`}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full">
                <FaRegEye size={18} />
              </button>
            </Link>

            {/* Edit Action */}
            <button className="w-7 h-7 flex items-center justify-center rounded-full">
              <FormModal table="ExpenseType" type="update" data={item} />
            </button>

            {/* Delete Action (Admin Only) */}
            {role === "admin" && (
              <button className="w-7 h-7 flex items-center justify-center rounded-full">
                <FormModal table="ExpenseType" type="delete" id={item.expenseTypeId} />
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
        {/* Header */}
        <div className="flex justify-between items-center p-4 gap-5">
          <h1 className="text-lg font-semibold">All Expenses</h1>
          <div className="flex items-center gap-2">
            {/* Search Input */}
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
            <Link
              href="#"
              className="inline-flex items-center justify-center gap-1.5 border border-white bg-primary dark:bg-transparent px-4 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-6 rounded-full"
            >
              <FormModal table="ExpenseType" type="create" />
              Add
            </Link>
          </div>
        </div>

        {/* Table */}
        <Table columns={columns} renderRow={renderRow} data={expensesType} />

        {/* Pagination */}
        <Pagination />
      </div>
    </DefaultLayout>
  );
};

export default AllExpenseTypePage;
