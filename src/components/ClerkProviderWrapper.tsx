'use client';

import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OfflineAuthProvider from "@/components/OfflineAuthProvider";

export default function ClerkProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        elements: {
          formButtonPrimary: 'bg-zinc-950 hover:bg-zinc-800',
          footerActionLink: 'text-zinc-950 hover:text-zinc-800',
          card: 'shadow-none',
          headerTitle: 'hidden',
          headerSubtitle: 'hidden',
          socialButtonsBlockButton: 'border-zinc-200 hover:bg-zinc-50',
          formFieldInput: 'w-full rounded-md bg-white px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400',
          formFieldLabel: 'text-sm font-medium text-zinc-950',
          formFieldError: 'text-sm text-red-400',
        },
      }}
    >
      <OfflineAuthProvider>
        <ToastContainer position="bottom-right" theme="dark" />
        {children}
      </OfflineAuthProvider>
    </ClerkProvider>
  );
} 