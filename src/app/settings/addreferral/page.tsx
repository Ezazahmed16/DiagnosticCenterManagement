import FormModal from "@/components/FormModal";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma, ReferredBy } from "@prisma/client";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { FaRegEye } from "react-icons/fa";
import { auth } from "@clerk/nextjs/server";  // Import Clerk's auth for user role

// Table columns definition
const columns = [
  {
    header: "Referral ID",
    accessor: "id",
  },
  {
    header: "Referral Name",
    accessor: "name",
  },
  {
    header: "Commission (%)",
    accessor: "commissionPercent",
  },
  {
    header: "Total Amount",
    accessor: "totalAmmount",
  },
  {
    header: "Amount Paid",
    accessor: "amountPaid",
  },
  {
    header: "Total Due",
    accessor: "totalDue",
  },
  {
    header: "Actions",
    accessor: "actions",
  },
];

// Row rendering function that depends on the user's role
const renderRow = (item: ReferredBy & { amountPaid: number; totalDue: number }, role: string) => {
  return (
    <tr key={item.id} className="border-b text-sm hover:bg-lamaPurpleLight">
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>{item.commissionPercent}%</td>
      <td>{item.totalAmmount}</td>
      <td>{item.amountPaid}</td>
      <td>{item.totalDue}</td>
      <td>
        <div className="flex items-center justify-start gap-1">
          <Link href={`/referrals/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full">
              <FaRegEye size={18} />
            </button>
          </Link>
          <button className="w-7 h-7 flex items-center justify-center rounded-full">
            <FormModal table="memoData" type="update" data="" />
          </button>
          {/* Admin only delete button */}
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

const AllReferralsPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // Fetch user role from Clerk authentication
  const { sessionClaims } = await auth();
  const userRole = (sessionClaims?.metadata as { role?: string })?.role || ""; // Default to empty string if no role

  const { page, search } = searchParams;
  const p = page ? parseInt(page) : 1;

  // Build the query for Prisma
  const query: Prisma.ReferredByWhereInput = {};
  if (search) {
    query.OR = [
      { name: { contains: search, mode: "insensitive" } },
    ];
  }

  // Fetch data using Prisma
  const [referredBy, count] = await prisma.$transaction([
    prisma.referredBy.findMany({
      where: query,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      include: {
        payments: true,
      },
    }),
    prisma.referredBy.count({ where: query }),
  ]);

  // Map data to include amountPaid and totalDue
  const dataWithPayments = referredBy.map((referral) => {
    const amountPaid = referral.payments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalDue = referral.totalAmmount - amountPaid;
    return {
      ...referral,
      amountPaid,
      totalDue,
    };
  });

  return (
    <DefaultLayout userRole={userRole}> {/* Pass the dynamic role here */}
      <div className="min-h-screen">
        {/* Top Section */}
        <div className="flex justify-between items-center p-4 gap-5">
          <h1 className="text-lg font-semibold">All Referrals</h1>
          <div className="flex justify-center items-center gap-2">
            <TableSearch />
            <Link
              href="#"
              className="inline-flex items-center justify-center gap-1.5 border border-white bg-primary dark:bg-transparent px-4 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-6 rounded-full"
            >
              <FormModal table="ReferalData" type="create" />
              Add
            </Link>
          </div>
        </div>

        {/* Table */}
        <Table columns={columns} renderRow={(item) => renderRow(item, userRole)} data={dataWithPayments} />

        {/* Pagination */}
        <Pagination page={p} count={count} />
      </div>
    </DefaultLayout>
  );
};

export default AllReferralsPage;
