import FormModal from "@/components/FormModal";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { referalsData, role } from "@/lib/data";  // Updated to import referalsData
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { FaEdit, FaPlus, FaPrint, FaRegEye } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

type ReferalData = {
  referalsId: number;
  referalsName: string;
  referalsCommission: string;
  totalAmmount: number;
  ammountPaid: number;
  totalDue: number;
};

const columns = [
  {
    header: "Referral ID",
    accessor: "referalsId",
  },
  {
    header: "Referral Name",
    accessor: "referalsName",
  },
  {
    header: "Commission",
    accessor: "referalsCommission",
  },
  {
    header: "Total Amount",
    accessor: "totalAmmount",
  },
  {
    header: "Amount Paid",
    accessor: "ammountPaid",
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

const AllReferralsPage = () => {
  const renderRow = (item: ReferalData) => (
    <tr key={item.referalsId} className="border-b text-sm hover:bg-lamaPurpleLight">
      <td>{item.referalsId}</td>
      <td>{item.referalsName}</td>
      <td>{item.referalsCommission}</td>
      <td>{item.totalAmmount}</td>
      <td>{item.ammountPaid}</td>
      <td>{item.totalDue}</td>
      <td>
        <div className="flex items-center justify-start gap-1">
          <Link href={`/referrals/${item.referalsId}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full">
              <FaRegEye size={18} />
            </button>
          </Link>
          <button className="w-7 h-7 flex items-center justify-center rounded-full">
            <FormModal table="ReferalData" type="update" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full">
            <FormModal table="ReferalData" type="delete" id={item.referalsId} />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <DefaultLayout userRole={role}>
      <div className="min-h-screen">
        {/* Top */}
        <div className="flex justify-between items-center p-4 gap-5">
          <h1 className="text-lg font-semibold">All Referrals</h1>
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
              <FormModal table="ReferalData" type="create" />
              Add
            </Link>
          </div>
        </div>

        {/* Table */}
        <Table columns={columns} renderRow={renderRow} data={referalsData} />

        {/* Pagination */}
        <Pagination />
      </div>
    </DefaultLayout>
  );
};

export default AllReferralsPage;
