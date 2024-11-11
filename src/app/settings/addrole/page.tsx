import FormModal from "@/components/FormModal";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { userData, role } from "@/lib/data";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { FaRegEye } from "react-icons/fa";

type UserData = {
  userId: number;
  userName: string;
  userEmail: string;
  userPassword: string;
  role: string[];
  userNumber: string;
};

const columns = [
  {
    header: "User ID",
    accessor: "userId",
  },
  {
    header: "User Name",
    accessor: "userName",
  },
  {
    header: "Email",
    accessor: "userEmail",
  },
  {
    header: "Roles",
    accessor: "role",
  },
  {
    header: "Phone Number",
    accessor: "userNumber",
  },
  {
    header: "Actions",
    accessor: "actions",
  },
];

const AllRolesPage = () => {
  const renderRow = (item: UserData) => (
    <tr key={item.userId} className="border-b text-sm hover:bg-lamaPurpleLight">
      <td>{item.userId}</td>
      <td>{item.userName}</td>
      <td>{item.userEmail}</td>
      <td>{item.role.join(", ")}</td>
      <td>{item.userNumber}</td>
      <td>
        <div className="flex items-center justify-start gap-1">
          <Link href={`/users/${item.userId}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full">
              <FaRegEye size={18} />
            </button>
          </Link>
          <Link href={`/users/${item.userId}/edit`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full">
              <FormModal table="UserData" type="update" />
            </button>
          </Link>
          {role === "admin" && (
            <button className="w-8 h-8 flex items-center justify-center rounded-full">
              <FormModal table="UserData" type="delete" id={item.userId} />
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
          <h1 className="text-lg font-semibold">All Users</h1>
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
              <FormModal table="UserData" type="create"/>
              Add Role
            </Link>
          </div>
        </div>

        {/* Table */}
        <Table columns={columns} renderRow={renderRow} data={userData} />

        {/* Pagination */}
        <Pagination />
      </div>
    </DefaultLayout>
  );
};

export default AllRolesPage;
