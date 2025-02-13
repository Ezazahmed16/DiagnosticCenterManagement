import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Metadata } from "next";

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "Alok Health Care - CRM For Diagnostic Centers",
  description:
    "Alok Health Care is a CRM for Diagnostic Centers. It helps you manage your patients, appointments, and reports.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        {/* <head>
          <meta name="description" content={metadata.description} />
          <meta name="title" content={metadata.title} />
        </head> */}
        <body className="dark:bg-boxdark-2 dark:text-bodydark">
          <div className="min-h-screen">
            <ToastContainer position="bottom-right" theme="dark" />
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
