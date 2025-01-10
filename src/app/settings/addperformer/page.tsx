import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import FormContainer from "@/components/FormContainer";

type Performer = {
  id: string;
  name: string;
  phone?: string; // Optional field
  commission?: number; // Optional field
  totalAmount?: number; // Optional field
  payable?: number; // Optional field
};

const columns = [
  { header: "Performer ID", accessor: "id" },
  { header: "Name", accessor: "name" },
  { header: "Phone", accessor: "phone" },
  { header: "Commission (%)", accessor: "commission" },
  { header: "Total Amount", accessor: "totalAmount" },
  { header: "Payable", accessor: "payable" },
  { header: "Actions", accessor: "actions" },
];

const renderRow = (item: Performer, role: string) => (
  <tr key={item.id} className="border-b text-sm">
    <td>{item.id}</td>
    <td>{item.name}</td>
    <td>{item.phone || "N/A"}</td>
    <td>{item.commission ?? "N/A"}</td>
    <td>{item.totalAmount?.toLocaleString() ?? 0}</td>
    <td>{item.payable?.toLocaleString() ?? 0}</td>
    <td>
      <div className="flex items-center justify-start gap-2">
        {role === "admin" && (
          <>
            <FormContainer
              table="PerformerData"
              type="update"
              data={item}
            />
            <FormContainer table="PerformerData" type="delete" id={item.id} />
          </>
        )}
      </div>
    </td>
  </tr>
);

const AllPerformerPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { sessionClaims } = await auth();
  const userRole = (sessionClaims?.metadata as { role?: string })?.role || "";

  const { page, search } = searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;

  const query: Prisma.PerformedByWhereInput = search
    ? { name: { contains: search, mode: "insensitive" } }
    : {};

  // Fetch performers and their count
  const [performers, count] = await prisma.$transaction([
    prisma.performedBy.findMany({
      where: query,
      include: { MemoToTest: true },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * ITEM_PER_PAGE,
      take: ITEM_PER_PAGE,
    }),
    prisma.performedBy.count({ where: query }),
  ]);


  // Calculate the total price (sum of `price`) for each performer
  const mappedPerformers = performers.map((performer) => {
    // Step 1: Calculate the total amount (sum of `price` for each test)
    const amountWithCommission = performer.MemoToTest.reduce(
      (sum, test) => sum + (test.price || 0),
      0
    );

    // Step 2: Calculate the commission amount if commission exists
    const commissionAmount = performer.commission
      ? amountWithCommission * (performer.commission / 100)
      : 0;

    // Step 3: Calculate the payable amount (after commission)
    const payableAmount = amountWithCommission - commissionAmount;

    // Map performers to ensure default values for missing fields
    return {
      ...performer,
      phone: performer.phone || "N/A",
      commission: performer.commission ?? "N/A",
      totalAmount: commissionAmount,
      payable: payableAmount, 
    };
  });

  return (
    <DefaultLayout userRole={userRole}>
      <div className="min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center p-4 gap-4">
          <h1 className="text-lg font-semibold">All Performers</h1>
          <div className="flex items-center gap-2">
            <TableSearch />
            {userRole === "admin" && (
              <FormContainer table="PerformerData" type="create" />
            )}
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          renderRow={(item) => renderRow(item, userRole)}
          data={mappedPerformers}
        />

        {/* Pagination */}
        <Pagination page={currentPage} count={count} />
      </div>
    </DefaultLayout>
  );
};

export default AllPerformerPage;
