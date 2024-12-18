import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import FormContainer from "@/components/FormContainer";

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

const renderRow = (item: any, role: string) => (
  <tr key={item.id} className="border-b text-sm">
    <td>{item.id}</td>
    <td>{item.name}</td>
    <td>{item.roomNo}</td>
    <td>{item.testCost}</td>
    <td>{item.additionalCost}</td>
    <td>{item.price}</td>
    <td>
      {item.PerformedBy?.name ? item.PerformedBy.name : "N/A"}
    </td>
    <td>
      <div className="flex items-center justify-start gap-2">
        {role === "admin" && (
          <>
            <FormContainer table="testData" type="update" data={item} />
            <FormContainer table="testData" type="delete" id={item.id} />
          </>
        )}
      </div>
    </td>
  </tr>
);

const AllTestsPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { sessionClaims } = await auth();
  const userRole = (sessionClaims?.metadata as { role?: string })?.role || "";

  const { page, search } = searchParams;
  const p = page ? parseInt(page, 10) : 1;

  const query: Prisma.TestWhereInput = {
    ...(search
      ? { name: { contains: search, mode: "insensitive" } }
      : {}),
  };

  // const [tests, count] = await prisma.$transaction([
  //   prisma.test.findMany({
  //     where: query,
  //     include: {
  //       PerformedBy: true, // Include the performer relation
  //       memos: { // This maps the `MemoToTest` join table
  //         include: {
  //           Memo: true, // Fetch the actual `Memo` records
  //         },
  //       },
  //     },
  //     skip: (p - 1) * ITEM_PER_PAGE,
  //     take: ITEM_PER_PAGE,
  //   }),
  //   prisma.test.count({
  //     where: query,
  //   }),
  // ]);
  const [tests, count] = await prisma.$transaction([
    prisma.test.findMany({
      where: query,
      include: {
        PerformedBy: true,
      },
      orderBy: {
        id: "desc"
      },
      skip: (p - 1) * ITEM_PER_PAGE,
      take: ITEM_PER_PAGE,
    }),
    prisma.test.count({
      where: query,
    }),
  ]);
  
  console.log("Fetched tests data:", tests);

  return (
    <DefaultLayout userRole={userRole}>
      <div className="min-h-screen">
        <div className="flex justify-between items-center p-4 gap-4">
          <h1 className="text-lg font-semibold">All Tests</h1>
          <div className="flex items-center gap-2">
            <TableSearch />
            {userRole === "admin" && (
              <FormContainer table="testData" type="create" />
            )}
          </div>
        </div>

        <Table
          columns={columns}
          renderRow={(item) => renderRow(item, userRole)}
          data={tests} // Pass the fetched tests data here
        />

        <Pagination page={p} count={count} />
      </div>
    </DefaultLayout>
  );
};

export default AllTestsPage;
