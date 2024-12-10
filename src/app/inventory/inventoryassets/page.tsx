import FormModal from "@/components/FormModal";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { Asset, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { format } from "date-fns";
import Link from "next/link";
import { FaRegEye } from "react-icons/fa";
import { role } from "@/lib/data";
import TableSearch from "@/components/TableSearch";

const columns = [
  {
    header: "ID",
    accessor: "id",
  },
  {
    header: "Title",
    accessor: "name",
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
    header: "Quantity",
    accessor: "qty",
  },
  {
    header: "Total",
    accessor: "value",
  },
  {
    header: "Purchased By",
    accessor: "purchaseBy",
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

const renderRow = (item: Asset) => (
  <tr key={item.id} className="border-b text-sm">
    <td>{item.id}</td>
    <td>{item.name}</td>
    <td>{item.description}</td>
    <td>{item.amount}</td>
    <td>{item.qty}</td>
    <td>{item.value}</td>
    <td>{item.purchasedBy}</td>
    <td>{format(new Date(item.createdAt), "MMMM dd, yyyy")}</td>
    <td>
      <div className="flex items-center justify-start gap-1">
        <Link href={`/assets/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full">
            <FaRegEye size={18} />
          </button>
        </Link>
        {role === "admin" && (
          <button className="w-7 h-7 flex items-center justify-center rounded-full">
            <FormModal table="AssetsData" type="update" data={item} />
          </button>
        )}
        {role === "admin" && (
          <button className="w-8 h-8 flex items-center justify-center rounded-full">
            <FormModal table="AssetsData" type="delete" id={item.id} />
          </button>
        )}
      </div>
    </td>
  </tr>
);

const AllInventoryList = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page = "1", search = "" } = searchParams;
  const p = parseInt(page);

  // Build the query for Prisma
  const query: Prisma.AssetWhereInput = {};
  if (search) {
    query.OR = [
      { name: { contains: search, mode: "insensitive" } },
    ];
  }

  // Fetch data from Prisma
  const [assets, count] = await prisma.$transaction([
    prisma.asset.findMany({
      where: query,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.asset.count({ where: query }),
  ]);

  return (
    <DefaultLayout userRole={role}>
      <div className="min-h-screen">
        {/* Top */}
        <div className="flex justify-between items-center p-4 gap-5">
          <h1 className="text-lg font-semibold">All Assets List</h1>
          <div className="flex justify-center items-center gap-2">
            <div className="relative">
              <TableSearch />
            </div>
            <Link
              href="#"
              className="inline-flex items-center justify-center gap-1.5 border border-white bg-primary dark:bg-transparent px-4 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-6 rounded-full"
            >
              <FormModal table="AssetsData" type="create" />
              Add
            </Link>
          </div>
        </div>

        {/* Table */}
        <Table columns={columns} renderRow={renderRow} data={assets} />

        {/* Pagination */}
        <Pagination page={p} count={count} />
      </div>
    </DefaultLayout>
  );
};

export default AllInventoryList;
