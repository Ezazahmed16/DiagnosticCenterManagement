import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import FormModal from "@/components/FormModal";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";

type Performer = {
  id: string;
  name: string;
  phone: string;
};

const columns = [
  { header: "Performer ID", accessor: "id" },
  { header: "Name", accessor: "name" },
  { header: "Phone", accessor: "phone" },
  { header: "Actions", accessor: "actions" },
];

const renderRow = (item: Performer, role: string) => (
  <tr key={item.id} className="border-b text-sm">
    <td>{item.id}</td>
    <td>{item.name}</td>
    <td>{item.phone || "N/A"}</td>
    <td>
      <div className="flex items-center justify-start gap-2">
        {role === "admin" && (
          <>
            <FormModal table="PerformerData" type="update" data={{
              id: item?.id, 
              name: item?.name,
              phone: item?.phone,
            }} />
            <FormModal table="PerformerData" type="delete" id={item.id} />
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
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * ITEM_PER_PAGE,
      take: ITEM_PER_PAGE,
    }),
    prisma.performedBy.count({ where: query }),
  ]);

  return (
    <DefaultLayout userRole={userRole}>
      <div className="min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center p-4 gap-4">
          <h1 className="text-lg font-semibold">All Performers</h1>
          <div className="flex items-center gap-2">
            <TableSearch />
            {userRole === "admin" && (
              <FormModal table="PerformerData" type="create" />
            )}
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          renderRow={(item) => renderRow(item, userRole)}
          data={performers}
        />

        {/* Pagination */}
        <Pagination page={currentPage} count={count} />
      </div>
    </DefaultLayout>
  );
};

export default AllPerformerPage;
