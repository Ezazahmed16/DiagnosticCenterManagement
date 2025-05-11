import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Metadata } from "next";
import ClerkProviderWrapper from "@/components/ClerkProviderWrapper";

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
<<<<<<< HEAD
        <meta name="description" content={metadata.description || ""} />
        <meta name="title" content={metadata.title?.toString() || ""} />
      </head>
      <body className="dark:bg-boxdark-2 dark:text-bodydark">
        <ClerkProviderWrapper>
          <div className="min-h-screen">
            <ToastContainer position="bottom-right" theme="dark" />
            {children}
          </div>
        </ClerkProviderWrapper>
=======
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
>>>>>>> 5925c4ff58a07d8bd391652aafae6dd7cd9ceb4e
      </body>
    </html>
  );
}
