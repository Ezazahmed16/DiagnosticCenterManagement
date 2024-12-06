import FormModal from "@/components/FormModal";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import { Patient, Memo } from "@prisma/client";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { FaRegEye } from "react-icons/fa";
import { format } from "date-fns";
import { ITEM_PER_PAGE } from "@/lib/settings";
import TableSearch from "@/components/TableSearch";


const columns = [
  {
    header: "Patient ID",
    accessor: "patientId",
  },
  {
    header: "Name",
    accessor: "name",
  },
  {
    header: "Phone",
    accessor: "phone",
  },
  {
    header: "Address",
    accessor: "address",
  },
  {
    header: "Last Visiting Date",
    accessor: "updatedAt",
  },
  {
    header: "Actions",
    accessor: "actions",
  },
];

const renderRow = (item: Patient & { memo: Memo[] }) => {
  return (
    <tr
      key={item.id}
      className="border-b text-sm hover:bg-lamaPurpleLight"
    >
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>{item.phone}</td>
      <td>{item.address}</td>
      <td>{format(new Date(item.updatedAt), "MMMM dd, yyyy h:mm a")}</td>
      <td>
        <div className="flex items-center justify-start gap-1">
          {/* View Button */}
          <Link href={`/receptionist/all-patients/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full">
              <FaRegEye size={18} />
            </button>
          </Link>
          {/* Edit Button */}
          <button className="w-7 h-7 flex items-center justify-center rounded-full">
            <FormModal table="patientData" type="update" data={{
              id: 1,
              patientId: "P1234567890",
              patientName: "Ezaz Ahmed",
              phone: "+8801726065822",
              email: "ezazrahul794@gmail.com",
              age: 28,
              gender: "male",
              address: "123 Main St, Dhaka, Bangladesh",
              status: "Due",
              memoId: ["5251", "16282"],
              registrationDate: "2024-10-25"
            }} />
          </button>

          {/* Delete Button (Only visible for admin) */}
          {role === "admin" && (
            <button className="w-8 h-8 flex items-center justify-center rounded-full">
              <FormModal table="patientData" type="delete" id={item.id} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

const AllPatientsPage = async (
  { searchParams, }: { searchParams: { [key: string]: string | undefined } }
) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  const [patients, count] = await prisma.$transaction([
    prisma.patient.findMany({
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1)
    }),
    prisma.patient.count()
  ])
  return (
    <DefaultLayout userRole={role}>
      <div className="min-h-screen">
        {/* Top Section */}
        <div className="flex justify-between items-center p-4 gap-5">
          <h1 className="text-lg font-semibold">All Patient</h1>
          <div className="flex justify-center items-center gap-2">
            <TableSearch />
            {/* Add Button */}
            <button
              className="inline-flex items-center justify-center gap-1.5 border border-white bg-primary dark:bg-transparent px-4 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-6 rounded-full"
            >
              <FormModal table="patientData" type="create" data="" />
              Add Patient
            </button>
          </div>
        </div>

        {/* Table */}
        <Table columns={columns} renderRow={renderRow} data={patients} />

        {/* Pagination */}
        <Pagination page={p} count={count} />
      </div>
    </DefaultLayout>
  );
};

export default AllPatientsPage;
