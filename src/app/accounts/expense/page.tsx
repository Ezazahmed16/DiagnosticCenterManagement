import FormContainer from "@/components/FormContainer";
import FormModal from "@/components/FormModal";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { ExpenseSchema } from "@/lib/FormValidationSchemas";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";

// Table Columns definition
const columns = [
  {
    header: "Title",
    accessor: "title",
  },
  {
    header: "Description",
    accessor: "description",
  },
  {
    header: "Amount",
    accessor: "amount",
  },

  {
    header: "Expense Type",
    accessor: "expenseType",
  },
  {
    header: "Date",
    accessor: "createdAt",
  },
  {
    header: "Actions",
    accessor: "actions",
  },
];

// Row rendering function that depends on the user's role
const renderRow = (item: ExpenseSchema & { expenseType?: { name: string } }, role: string) => (
  <tr key={item.id} className="border-b text-sm hover:bg-lamaPurpleLight">
    <td>{item.title}</td>
    <td>{item.description}</td>
    <td>{item.amount}</td>
    <td>{item.expenseType?.name}</td>
    <td>{format(new Date(item.date), "MMMM dd, yyyy")}</td>
    <td>
      <div className="flex items-center justify-start gap-1">
        {role === "admin" && (
          <>
            <button className="w-7 h-7 flex items-center justify-center rounded-full">
              <>
                <FormContainer table="ExpenseData" type="update" data={item} />
              </>
            </button>
            {/* Delete Action (Admin Only) */}
            {role === "admin" && (
              <button className="w-7 h-7 flex items-center justify-center rounded-full">
                <FormModal table="ExpenseData" type="delete" id={item.id} />
              </button>
            )}
          </>
        )}
      </div>
    </td>
  </tr>
);

const AllExpensesPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
  // Fetch user role from Clerk authentication
  const { sessionClaims } = await auth();
  const userRole = (sessionClaims?.metadata as { role?: string })?.role || "";
  const { page, search } = searchParams;
  const p = page ? parseInt(page) : 1;

  // Build the query for Prisma
  const query: Prisma.ExpenseWhereInput = {};
  if (search) {
    query.OR = [
      { title: { contains: search, mode: "insensitive" } },
    ];
  }

  // Fetch data using Prisma
  const [expenses, count] = await prisma.$transaction([
    prisma.expense.findMany({
      include: {
        expenseType: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
      where: query,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.expense.count({ where: query }),
  ]);

  return (
    <DefaultLayout userRole={userRole}> {/* Pass userRole here */}
      <div className="min-h-screen">
        {/* Top Section */}
        <div className="flex justify-between items-center p-4 gap-5">
          <h1 className="text-lg font-semibold">All Expenses</h1>
          <div className="flex justify-center items-center gap-2">
            <TableSearch />
            <div
              className="inline-flex items-center justify-center gap-1.5 border border-white bg-primary dark:bg-transparent px-4 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-6 rounded-full"
            >
              <FormContainer table="ExpenseData" type="create" data='' />
              Add
            </div>
          </div>
        </div>

        {/* Table Section */}
        <Table columns={columns} renderRow={(item) => renderRow(item, userRole)} data={expenses} />

        {/* Pagination Section */}
        <Pagination page={p} count={count} />
      </div>
    </DefaultLayout>
  );
};

export default AllExpensesPage;
