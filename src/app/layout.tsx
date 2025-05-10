import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Metadata } from "next";
import OfflineAuthProvider from "@/components/OfflineAuthProvider";

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
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="dark:bg-boxdark-2 dark:text-bodydark">
        <div className="min-h-screen">
          <ClerkProvider
            appearance={{
              baseTheme: undefined,
              elements: {
                formButtonPrimary: 'bg-primary hover:bg-primary/90',
                footerActionLink: 'text-primary hover:text-primary/90',
              },
            }}
          >
            <ToastContainer position="bottom-right" theme="dark" />
            <OfflineAuthProvider>
              {children}
            </OfflineAuthProvider>
          </ClerkProvider>
        </div>
      </body>
    </html>
  );
}
