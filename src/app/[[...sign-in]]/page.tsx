'use client'

import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MdWifiOff } from 'react-icons/md'
import Image from 'next/image'

export default function SignInPage() {
    const { isLoaded, isSignedIn, user } = useUser();
    const router = useRouter();
    const [isOnline, setIsOnline] = useState(
        typeof navigator !== 'undefined' ? navigator.onLine : true
    );

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        if (isLoaded && isSignedIn && user?.publicMetadata.role) {
            router.push(`/${user.publicMetadata.role}`);
        }
    }, [isLoaded, isSignedIn, user, router]);

    return (
        <div className="grid h-screen w-full flex-grow items-center bg-zinc-100 px-4 sm:justify-center">
            {isOnline ? (
                <SignIn.Root>
                    <SignIn.Step
                        name="start"
                        className="w-full space-y-6 rounded-2xl bg-white px-4 py-10 shadow-md ring-1 ring-black/5 sm:w-96 sm:px-8"
                    >
                        <header>
                            {/* <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 40 40"
                                className="mx-auto size-10 text-zinc-950"
                                aria-hidden
                            >
                                <mask id="a" width="40" height="40" x="0" y="0" maskUnits="userSpaceOnUse">
                                    <circle cx="20" cy="20" r="20" fill="#D9D9D9" />
                                </mask>
                                <g fill="currentColor" mask="url(#a)">
                                    <path d="M43.5 3a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46V2ZM43.5 8a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46V7ZM43.5 13a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 18a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 23a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 28a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 33a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1ZM43.5 38a.5.5 0 0 0 0-1v1Zm0-1h-46v1h46v-1Z" />
                                    <path d="M27 3.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM25 8.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM23 13.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM21.5 18.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM20.5 23.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM22.5 28.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM25 33.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2ZM27 38.5a1 1 0 1 0 0-2v2Zm0-2h-46v2h46v-2Z" />
                                </g>
                            </svg> */}
                            <Image src="/images/logo/logo.png" alt="Alok HealthCare Logo" className="mx-auto" height={64} width={64} />
                            <h1 className="mt-4 text-xl font-medium tracking-tight text-zinc-950 text-center mx-auto">
                                Sign in to Alok HealthCare
                            </h1>
                        </header>
                        <Clerk.GlobalError className="block text-sm text-red-400" />
                        <div>
                            <Clerk.Field name="identifier" className="space-y-2">
                                <Clerk.Label className="text-sm font-medium text-zinc-950">Username</Clerk.Label>
                                <Clerk.Input
                                    type="text"
                                    required
                                    className="w-full rounded-md bg-white px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
                                />
                                <Clerk.FieldError className="block text-sm text-red-400" />
                            </Clerk.Field>
                            <Clerk.Field name="password" className="space-y-2">
                                <Clerk.Label className="text-sm  font-medium text-zinc-950">Password</Clerk.Label>
                                <Clerk.Input
                                    type="password"
                                    required
                                    className="w-full rounded-md bg-white px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
                                />
                                <Clerk.FieldError className="block text-sm text-red-400" />
                            </Clerk.Field>
                        </div>
                        <SignIn.Action
                            submit
                            className="w-full rounded-md bg-zinc-950 px-3.5 py-1.5 text-center text-sm font-medium text-white shadow outline-none ring-1 ring-inset ring-zinc-950 hover:bg-zinc-800 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:text-white/70"
                        >
                            Sign In
                        </SignIn.Action>
                    </SignIn.Step>
                </SignIn.Root>
            ) : (
                <div className="w-full space-y-6 rounded-2xl bg-white px-4 py-10 shadow-md ring-1 ring-black/5 sm:w-96 sm:px-8">
                    <div className="flex flex-col items-center">
                        <MdWifiOff className="text-red-500 size-10" />
                        <h1 className="mt-4 text-xl font-medium tracking-tight text-zinc-950">
                            You are offline
                        </h1>
                        <p className="mt-2 text-center text-gray-500">
                            Internet connection is required for standard login.
                        </p>
                    </div>
                    <Link 
                        href="/offline-login"
                        className="block w-full rounded-md bg-zinc-950 px-3.5 py-1.5 text-center text-sm font-medium text-white shadow outline-none ring-1 ring-inset ring-zinc-950 hover:bg-zinc-800 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
                    >
                        Continue with Offline Login
                    </Link>
                    <div className="text-xs text-gray-500 mt-4 text-center">
                        <p>To use offline mode, you must have previously signed in online and prepared offline data</p>
                    </div>
                </div>
            )}
        </div>
    )
}