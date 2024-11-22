import FormModal from "@/components/FormModal";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { assetsData, role } from "@/lib/data";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { FaRegEye } from "react-icons/fa";

type AssetsData = {
  assetsId: number;
  assetsTitle: string;
  purchaseAmount: number;
  purchaseQty: number;
  totalPurchase: number;
  purchaseBy: string;
};

const columns = [
  {
    header: "Asset ID",
    accessor: "assetsId",
  },
  {
    header: "Title",
    accessor: "assetsTitle",
  },
  {
    header: "Amount",
    accessor: "purchaseAmount",
  },
  {
    header: "Quantity",
    accessor: "purchaseQty",
  },
  {
    header: "Total Purchase",
    accessor: "totalPurchase",
  },
  {
    header: "Purchased By",
    accessor: "purchaseBy",
  },
  {
    header: "Actions",
    accessor: "actions",
  },
];

const AllInventoryList = () => {
  const renderRow = (item: AssetsData) => (
    <tr key={item.assetsId} className="border-b text-sm hover:bg-lamaPurpleLight">
      <td>{item.assetsId}</td>
      <td>{item.assetsTitle}</td>
      <td>{item.purchaseAmount}</td>
      <td>{item.purchaseQty}</td>
      <td>{item.totalPurchase}</td>
      <td>{item.purchaseBy}</td>
      <td>
        <div className="flex items-center justify-start gap-1">
          <Link href={`/assets/${item.assetsId}`}>
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
              <FormModal table="AssetsData" type="delete" id={item.assetsId} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <DefaultLayout userRole={role}>
      <div className="min-h-screen">
        {/* Top */}
        <div className="flex justify-between items-center p-4 gap-5">
          <h1 className="text-lg font-semibold">All Assets List</h1>
          <div className="flex justify-center items-center gap-2">
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
        <Table columns={columns} renderRow={renderRow} data={assetsData} />

        {/* Pagination */}
        <Pagination />
      </div>
    </DefaultLayout>
  );
};

export default AllInventoryList;
