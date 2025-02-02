import FormModal from "@/components/FormModal";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";
import { FaPrint, FaRegEye } from "react-icons/fa";
import { auth } from "@clerk/nextjs/server";
import FormContainer from "@/components/FormContainer";
import RenderPrintButton from "@/components/RenderPrintButton";


type MemoWithPatient = Prisma.MemoGetPayload<{
  include: {
    Patient: { select: { id: true, name: true; phone: true; address: true } };
    MemoToTest: { select: { testId: true; testName: true; deliveryTime: true; roomNo: true, price: true } };
    referredBy: { select: { id: true; name: true } };
  };
}>;

const columns = [
  { header: "Memo ID", accessor: "memoNo" },
  { header: "Name", accessor: "Patient.name" },
  { header: "Contact", accessor: "Patient.phone" },
  { header: "Total Amount", accessor: "totalAmount" },
  { header: "Status", accessor: "paymentMethod" },
  { header: "Date", accessor: "createdAt" },
  { header: "Actions", accessor: "actions" },
];

const renderRow = (item: any, role: string) => (
  <tr key={item.id} className="border-b text-sm my-2">
    <td>{item.memoNo}</td>
    <td>{item?.name}</td>
    <td>{item.phone}</td>
    <td>{item.totalAmount}</td>
    <td>
      {item.paymentMethod === "DUE" ? (
        <p className="bg-red-600 text-white w-min p-1 rounded-full">{item.paymentMethod}</p>
      ) : (
        <p className="bg-success text-white w-min p-1 rounded-full">{item.paymentMethod}</p>
      )}
    </td>
    <td>{format(new Date(item.createdAt), "MMMM dd, yyyy h:mm a")}</td>
    <td>
      <div className="flex items-center justify-start gap-1">
        <Link href={`/receptionist/all-memos/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full">
            <FaRegEye size={18} />
          </button>
        </Link>
        <button className="w-7 h-7 flex items-center justify-center rounded-full">
          <FormContainer table="memoData" type="update" data={item} />
        </button>
        <div className="">
          <RenderPrintButton item={item} />
        </div>
        {role === "admin" && (
          <button className="w-8 h-8 flex items-center justify-center rounded-full">
            <FormContainer table="memoData" type="delete" id={item.id} />
          </button>
        )}
      </div>
    </td>
  </tr>
);

const AllMemosPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
  const { sessionClaims } = await auth();
  const userRole = (sessionClaims?.metadata as { role?: string })?.role || "";

  const { page, search } = searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.MemoWhereInput = {};
  if (search) {
    query.OR = [
      { id: { contains: search, mode: "insensitive" } },
      { Patient: { phone: { contains: search, mode: "insensitive" } } },
    ];
  }
  const [memo, count] = await prisma.$transaction([
    prisma.memo.findMany({
      orderBy: {
        createdAt: "desc"
      },
      include: {
        Patient: { select: { id: true, name: true, phone: true, address: true, gender: true, dateOfBirth: true } },
        referredBy: { select: { name: true, id: true } },
        MemoToTest: { select: { testId: true, testName: true, deliveryTime: true, roomNo: true, price: true } },
      },
      where: query,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.memo.count({ where: query }),
  ]);

  return (
    <DefaultLayout userRole={userRole}>
      <div className="min-h-screen">
        <div className="flex justify-between items-center p-4 gap-5">
          <h1 className="text-lg font-semibold">All Memos</h1>
          <div className="flex justify-center items-center gap-2">
            <TableSearch />
            <button
              className="inline-flex items-center justify-center gap-1.5 border border-white bg-primary dark:bg-transparent px-4 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-6 rounded-full"
            >
              <FormContainer table="memoData" type="create" data='' />
              Add
            </button>
          </div>
        </div>
        {memo.length === 0 ? (
          <div className="text-xl text-center py-5 text-gray-500">Patient not found</div>
        ) : (
          <Table columns={columns} renderRow={(item) => renderRow(item, userRole)} data={memo} />
        )}
        <Pagination page={p} count={count} />
      </div>
    </DefaultLayout>
  );
};

export default AllMemosPage;


