import FormModal from "@/components/FormModal";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma, Test } from "@prisma/client";
import Link from "next/link";
import { FaRegEye } from "react-icons/fa";
import { auth } from "@clerk/nextjs/server";  // Import auth to get the user's role

// Table Columns definition
const columns = [
  { header: "Test ID", accessor: "id" },
  { header: "Test Name", accessor: "name" },
  { header: "Room No", accessor: "roomNo" },
  { header: "Amount", accessor: "testCost" },
  { header: "Additional Cost", accessor: "additionalCost" },
  { header: "Total Amount", accessor: "price" },
  { header: "Performed By", accessor: "performedByName" },
  { header: "Actions", accessor: "actions" },
];

// Row rendering function that depends on the user's role
const renderRow = (item: Test & { memos: { performedBy?: { name: string } }[] }, role: string) => (
  <tr key={item.id} className="border-b text-sm hover:bg-lamaPurpleLight">
    <td>{item.id}</td>
    <td>{item.name}</td>
    <td>{item.roomNo}</td>
    <td>{item.testCost}</td>
    <td>{item.additionalCost}</td>
    <td>{item.price}</td>
    <td>
      {
        item.memos?.length && item.memos[0]?.performedBy?.name
          ? item.memos[0].performedBy.name
          : "N/A"
      }
    </td>
    <td>
      <div className="flex items-center justify-start gap-1">
        <Link href={`/receptionist/all-patients/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full">
            <FaRegEye size={18} />
          </button>
        </Link>
        {role === "admin" && (
          <button className="w-7 h-7 flex items-center justify-center rounded-full">
            <FormModal table="testData" type="update" />
          </button>
        )}
        {role === "admin" && (
          <button className="w-8 h-8 flex items-center justify-center rounded-full">
            <FormModal table="testData" type="delete" id={item.id} />
          </button>
        )}
      </div>
    </td>
  </tr>
);

const AllTestsPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
  // Fetch user role from Clerk authentication
  const { sessionClaims } = await auth();
  const userRole = (sessionClaims?.metadata as { role?: string })?.role || "";  // Default to empty string if role is not found

  const { page, search } = searchParams;
  const p = page ? parseInt(page) : 1;

  // Build the Prisma query
  const query: Prisma.TestWhereInput = search
    ? { name: { contains: search, mode: "insensitive" } }
    : {};

  // Fetch data from Prisma
  const [memo, count] = await prisma.$transaction([
    prisma.test.findMany({
      include: {
        memos: {
          include: {
            performedBy: { select: { name: true } }, // Include performedBy relation
          },
        },
      },
      where: query,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.test.count({ where: query }),
  ]);

  return (
    <DefaultLayout userRole={userRole}> {/* Pass userRole here */}
      <div className="min-h-screen">
        {/* Top Section */}
        <div className="flex justify-between items-center p-4 gap-5">
          <h1 className="text-lg font-semibold">All Tests</h1>
          <div className="flex justify-center items-center gap-2">
            <TableSearch />
            <Link
              href="#"
              className="inline-flex items-center justify-center gap-1.5 border border-white bg-primary dark:bg-transparent px-4 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-6 rounded-full"
            >
              <FormModal table="testData" type="create" />
              Add
            </Link>
          </div>
        </div>

        {/* Table */}
        <Table columns={columns} renderRow={(item) => renderRow(item, userRole)} data={memo} />

        {/* Pagination */}
        <Pagination page={p} count={count} />
      </div>
    </DefaultLayout>
  );
};

export default AllTestsPage;
