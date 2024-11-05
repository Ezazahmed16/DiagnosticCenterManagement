import Dashboard from "@/components/Dashboard/Dashboard";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { role } from "@/lib/data";

export const metadata: Metadata = {
  title:
    "Diagnostic Center",
  description: "Reception Management System For Diagnostic Center",
};

export default function Home() {
  return (
    <>
      <DefaultLayout  userRole={role}>
        <Dashboard />
      </DefaultLayout>
    </>
  );
}
