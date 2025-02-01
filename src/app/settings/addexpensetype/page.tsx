import FormModal from "@/components/FormModal";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Link from "next/link";
import { Prisma, ExpenseType } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import TableSearch from "@/components/TableSearch";
import { auth } from "@clerk/nextjs/server";

// Table columns definition
const columns = [
  {
    header: "Expense ID",
    accessor: "id",
  },
  {
    header: "Expense Type",
    accessor: "name",
  },
  {
    header: "Description",
    accessor: "description",
  },
  {
    header: "Actions",
    accessor: "actions",
  },
];

// Row rendering function that depends on the user's role
const renderRow = (item: ExpenseType, role: string) => {
  return (
    <tr key={item.id} className="border-b text-sm hover:bg-lamaPurpleLight">
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>{item.description}</td>
      <td>
        <div className="flex items-center justify-start gap-2">
          {/* Edit Action */}
          <button className="w-7 h-7 flex items-center justify-center rounded-full">
            <FormModal table="ExpenseType" type="update" data={item} />
          </button>

          {/* Delete Action (Admin Only) */}
          {role === "admin" && (
            <button className="w-7 h-7 flex items-center justify-center rounded-full">
              <FormModal table="ExpenseType" type="delete" id={item.id} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

const AllExpenseTypePage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // Fetch user role from Clerk authentication
  const { sessionClaims } = await auth();
  const userRole = (sessionClaims?.metadata as { role?: string })?.role || ""; // Default to empty string if role is not found

  const { page, search } = searchParams;
  const p = page ? parseInt(page) : 1;

  // Build the query for Prisma
  const query: Prisma.ExpenseTypeWhereInput = {};
  if (search) {
    query.OR = [{ name: { contains: search, mode: "insensitive" } }];
  }

  // Fetch data using Prisma
  const [expenseType, count] = await prisma.$transaction([
    prisma.expenseType.findMany({
      where: query,
      orderBy: { createdAt: 'desc' },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.expenseType.count({ where: query }),
  ]);

  return (
    <DefaultLayout userRole={userRole}> {/* Pass userRole here */}
      <div className="min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center p-4 gap-5">
          <h1 className="text-lg font-semibold">All Expenses</h1>
          <div className="flex items-center gap-2">
            {/* Search Input */}
            <TableSearch />

            {/* Add Button */}
            <div
              className="inline-flex items-center justify-center gap-1.5 border border-white bg-primary dark:bg-transparent px-4 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-6 rounded-full"
            >
              <FormModal table="ExpenseType" type="create" />
              Add
            </div>
          </div>
        </div>

        {/* Table */}
        <Table columns={columns} renderRow={(item) => renderRow(item, userRole)} data={expenseType} />

        {/* Pagination */}
        <Pagination page={p} count={count} />
      </div>
    </DefaultLayout>
  );
};

export default AllExpenseTypePage;
