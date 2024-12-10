import FormModal from "@/components/FormModal";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";
import { FaPrint, FaRegEye } from "react-icons/fa";

type MemoWithPatient = Prisma.MemoGetPayload<{
  include: { Patient: { select: { name: true; phone: true; address: true } } };
}>;

const columns = [
  {
    header: "Memo ID",
    accessor: "memoId",
  },
  {
    header: "Name",
    accessor: "Patient.name",
  },
  {
    header: "Contact",
    accessor: "Patient.phone",
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

const renderRow = (item: MemoWithPatient) => {
  return (
    <tr key={item.id} className="border-b text-sm my-2">
      <td>{item.id}</td>
      <td>{item.Patient?.name}</td>
      <td>{item.Patient?.phone}</td>
      <td>{item.totalAmount}</td>
      <td>
        {
          item.paymentMethod === "DUE" ? 
            <p className="bg-red-600 text-white w-min p-1 rounded-full">{item.paymentMethod}</p> :
            <p className="bg-success text-white w-min p-1 rounded-full">{item.paymentMethod}</p>
        }
      </td>
      <td>{format(new Date(item.createdAt), "MMMM dd, yyyy h:mm a")}</td>
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

const AllMemosPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, search } = searchParams;
  const p = page ? parseInt(page) : 1;

  // Build the query for Prisma
  const query: Prisma.MemoWhereInput = {};
  if (search) {
    query.OR = [
      { id: { contains: search, mode: "insensitive" } }, // Search by memoId
      {
        Patient: {
          phone: { contains: search, mode: "insensitive" }, // Search by Patient phone
        },
      },
    ];
  }

  // Fetch data using Prisma
  const [memo, count] = await prisma.$transaction([
    prisma.memo.findMany({
      include: {
        Patient: {
          select: { name: true, phone: true, address: true },
        },
      },
      where: query, // Apply the search query
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.memo.count({ where: query }), 
  ]);

  return (
    <DefaultLayout userRole={role}>
      <div className="min-h-screen">
        {/* Top Section */}
        <div className="flex justify-between items-center p-4 gap-5">
          <h1 className="text-lg font-semibold">All Memos</h1>
          <div className="flex justify-center items-center gap-2">
            <TableSearch />
            <button
              className="inline-flex items-center justify-center gap-1.5 border border-white bg-primary dark:bg-transparent px-4 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-6 rounded-full"
            >
              <FormModal table="memoData" type="create" />
              Add
            </button>
          </div>
        </div>

        {/* Table */}
        {memo.length === 0 ? (
          <div className="text-xl text-center py-5 text-gray-500">Patient not found</div>
        ) : (
          <Table columns={columns} renderRow={renderRow} data={memo} />
        )}

        {/* Pagination */}
        <Pagination page={p} count={count} />
      </div>
    </DefaultLayout>
  );
};

export default AllMemosPage;
