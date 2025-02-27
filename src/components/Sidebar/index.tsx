"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";

import { MdInventory, MdOutlineDashboard } from "react-icons/md";
import { FaUserTag } from "react-icons/fa";
import { MdAccountBalanceWallet } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { role } from "@/lib/data";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  userRole: string;
}

const menuGroups = [
  {
    name: "MENU",
    menuItems: [
      {
        icon: <MdOutlineDashboard />,
        label: "Dashboard",
        route: "/",
        visible: ["admin", "accounts", "receptionist", "inventory"],
      },
      {
        icon: <FaUserTag />,
        label: "Receptionist",
        route: "/receptionist/all-memos",
        visible: ["admin", "receptionist"],
        children: [
          { label: "All Patients", route: "/receptionist/all-patients" },
          { label: "All Memos", route: "/receptionist/all-memos" },
        ],
      },
      {
        icon: <MdAccountBalanceWallet />,
        label: "Accounts",
        route: "/accounts",
        visible: ["admin", "accounts"],
        children: [{ label: "Expense", route: "/accounts/expense" }],
      },
      {
        icon: <MdInventory />,
        label: "Inventory",
        route: "/inventory",
        visible: ["admin", "inventory"],
        children: [{ label: "Assets", route: "/inventory/inventoryassets" }],
      },
    ],
  },
  {
    name: "OTHERS",
    menuItems: [
      {
        icon: <CiSettings />,
        label: "Settings",
        route: "/settings",
        visible: ["admin"],
        children: [
          { label: "Add Role", route: "/settings/addrole" },
          { label: "Add Test", route: "/settings/addtest" },
          { label: "Add Expense Type", route: "/settings/addexpensetype" },
          { label: "Add Referral", route: "/settings/addreferral" },
          { label: "Add Test Performer", route: "/settings/addperformer" },
        ],
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen, userRole = role }: SidebarProps) => {
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-10 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 mx-auto">
          <Link href="/">
            <Image
              width={160}
              height={80}
              src={"/images/logo/logo.png"}
              alt="Logo"
              priority
            />
          </Link>

          {/* <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button> */}
        </div>
        {/* Sidebar Header */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* Sidebar Menu */}
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.menuItems
                    .filter((menuItem) => menuItem.visible.includes(userRole))
                    .map((menuItem, menuIndex) => (
                      <SidebarItem
                        key={menuIndex}
                        item={menuItem}
                        pageName={pageName}
                        setPageName={setPageName}
                      />
                    ))}
                </ul>
              </div>
            ))}
          </nav>
          {/* Sidebar Menu */}
        </div>

        {/* Sidebar Footer */}
        <div className="mt-auto flex items-center justify-center h-20 bg-gray-950">
          <h1 className="text-sm font-semibold">Developed By:</h1>
          <Image
            width={160}
            height={80}
            src={"/images/logo/skysoftpro.png"}
            alt="SkysoftPro Logo"
            priority
          />
        </div>


      </aside>
    </ClickOutside>
  );
};

export default Sidebar;