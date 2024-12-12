import FormModal from "@/components/FormModal";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
const Pagination = dynamic(() => import("@/components/Pagination"), { ssr: false });

import Table from "@/components/Table";
import prisma from "@/lib/prisma";
import { Patient, Memo, Prisma } from "@prisma/client";
import Link from "next/link";
import { FaRegEye } from "react-icons/fa";
import { format } from "date-fns";
import { ITEM_PER_PAGE } from "@/lib/settings";
import TableSearch from "@/components/TableSearch";
import { auth } from "@clerk/nextjs/server";
import dynamic from "next/dynamic";

const columns = [
  { header: "Patient ID", accessor: "patientId" },
  { header: "Name", accessor: "name" },
  { header: "Phone", accessor: "phone" },
  { header: "Address", accessor: "address" },
  { header: "Last Visiting Date", accessor: "updatedAt" },
  { header: "Actions", accessor: "actions" },
];

const renderRow = (item: Patient & { memo: Memo[] }, role: string) => (
  <tr key={item.id} className="border-b text-sm hover:bg-lamaPurpleLight">
    <td>{item.id}</td>
    <td>{item.name}</td>
    <td>{item.phone}</td>
    <td>{item.address}</td>
    <td>{format(new Date(item.updatedAt), "MMMM dd, yyyy h:mm a")}</td>
    <td>
      <div className="flex items-center justify-start gap-1">
        <Link href={`/receptionist/all-patients/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full">
            <FaRegEye size={18} />
          </button>
        </Link>
        <button className="w-7 h-7 flex items-center justify-center rounded-full">
          <FormModal table="patientData" type="update" data={item} />
        </button>
        {role === "admin" && (
          <button className="w-8 h-8 flex items-center justify-center rounded-full">
            <FormModal table="patientData" type="delete" id={item.id} />
          </button>
        )}
      </div>
    </td>
  </tr>
);

const AllPatientsPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
  // Fetch auth session and user role
  const { sessionClaims } = await auth();
  const userRole = (sessionClaims?.metadata as { role?: string })?.role || "user"; // Default to 'user' if undefined

  const { page, search } = searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.PatientWhereInput = {};
  if (search) {
    query.OR = [{ phone: { contains: search, mode: "insensitive" } }];
  }

  const [patients, count] = await prisma.$transaction([
    prisma.patient.findMany({
      where: query,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.patient.count({ where: query }),
  ]);

  return (
    <DefaultLayout userRole={userRole}>
      <div className="min-h-screen">
        <div className="flex justify-between items-center p-4 gap-5">
          <h1 className="text-lg font-semibold">All Patient</h1>
          <div className="flex justify-center items-center gap-2">
            <TableSearch />
            <button className="inline-flex items-center justify-center gap-1.5 border border-white bg-primary dark:bg-transparent px-4 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-6 rounded-full">
              <FormModal table="patientData" type="create" data="" />
              Add Patient
            </button>
          </div>
        </div>
        <Table
          columns={columns}
          renderRow={(item) => renderRow(item, userRole)} 
          data={patients}
        />
        <Pagination page={p} count={count} />
      </div>
    </DefaultLayout>
  );
};

export default AllPatientsPage;
