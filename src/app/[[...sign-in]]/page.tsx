'use client'

import { useSignIn } from "@clerk/nextjs";
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MdWifiOff } from 'react-icons/md';
import Image from 'next/image';
import { toast } from 'react-toastify';

export default function SignInPage() {
    const { isLoaded, isSignedIn, user } = useUser();
    const { signIn, isLoaded: isSignInLoaded } = useSignIn();
    const router = useRouter();
    const [isOnline, setIsOnline] = useState(
        typeof navigator !== 'undefined' ? navigator.onLine : true
    );
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSignInLoaded) return;

        setIsLoading(true);
        try {
            const result = await signIn.create({
                identifier,
                password,
            });

            if (result.status === "complete") {
                // Sign in successful
                toast.success("Sign in successful!");
                // The session will be automatically set active by Clerk
                // No need to manually set it
            } else {
                // Handle multi-factor authentication if needed
                console.log("Multi-factor authentication required");
            }
        } catch (err: any) {
            toast.error(err.errors?.[0]?.message || "Sign in failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid h-screen w-full flex-grow items-center bg-zinc-100 px-4 sm:justify-center">
            {isOnline ? (
                <div className="w-full space-y-6 rounded-2xl bg-white px-4 py-10 shadow-md ring-1 ring-black/5 sm:w-96 sm:px-8">
                    <header>
                        <div className="relative h-16 w-16 mx-auto">
                            <Image 
                                src="/images/logo/logo.png" 
                                alt="Alok HealthCare Logo" 
                                fill
                                className="object-contain"
                                priority
                                sizes="(max-width: 768px) 64px, 64px"
                                // onError={(e) => {
                                //     // Fallback to a text logo if image fails to load
                                //     const target = e.target as HTMLImageElement;
                                //     target.style.display = 'none';
                                //     const parent = target.parentElement;
                                //     if (parent) {
                                //         const fallback = document.createElement('div');
                                //         fallback.className = 'text-2xl font-bold text-zinc-950';
                                //         fallback.textContent = 'AHC';
                                //         parent.appendChild(fallback);
                                //     }
                                // }}
                            />
                        </div>
                        <h1 className="mt-4 text-xl font-medium tracking-tight text-zinc-950 text-center mx-auto">
                            Sign in to Alok HealthCare
                        </h1>
                    </header>
                    <form onSubmit={handleSignIn} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="identifier" className="text-sm font-medium text-zinc-950">
                                Username or Email
                            </label>
                            <input
                                id="identifier"
                                type="text"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                                className="w-full rounded-md bg-white px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
                                placeholder="Enter your username or email"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-zinc-950">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full rounded-md bg-white px-3.5 py-2 text-sm outline-none ring-1 ring-inset ring-zinc-300 hover:ring-zinc-400 focus:ring-[1.5px] focus:ring-zinc-950 data-[invalid]:ring-red-400"
                                placeholder="Enter your password"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-md bg-zinc-950 px-3.5 py-2 text-center text-sm font-medium text-white shadow outline-none ring-1 ring-inset ring-zinc-950 hover:bg-zinc-800 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-zinc-950 disabled:bg-zinc-400"
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>
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
    );
}