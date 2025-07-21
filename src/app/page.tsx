
"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { useAuth } from "@/hooks/use-auth";
import { signInWithGoogle } from "@/lib/firebase/auth";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.012,35.245,44,30.038,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
        </svg>
    )
}

export default function LandingPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (!loading && user) {
            router.replace('/feed');
        }
    }, [user, loading, router]);


    if (loading || user) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
        try {
            await signInWithGoogle();
        } catch (error) {
            toast({ variant: "destructive", title: "Login Failed", description: (error as Error).message });
            setIsGoogleLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Logo className="h-10 w-10" />
                        <span className="text-2xl font-bold text-foreground">RuralStar</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" asChild><Link href="/register">Join now</Link></Button>
                        <Button variant="outline" asChild><Link href="/login">Sign in</Link></Button>
                    </div>
                </div>
            </header>
            <main className="container mx-auto px-6 py-16 md:py-24">
                <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                            Showcase your talent. <span className="text-primary">Connect with opportunity.</span>
                        </h1>
                        <p className="mt-6 text-lg text-muted-foreground">
                            The premier platform for rural athletes to get discovered by scouts, coaches, and sponsors from around the globe.
                        </p>
                        <div className="mt-8 flex flex-col items-center space-y-4 md:items-start">
                             <Button size="lg" className="w-full max-w-sm" onClick={handleGoogleSignIn} disabled={isGoogleLoading}>
                               {isGoogleLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <GoogleIcon className="mr-2" />}
                               Continue with Google
                            </Button>
                             <Button size="lg" variant="outline" className="w-full max-w-sm" onClick={() => router.push('/login')}>
                                Sign in with email
                            </Button>
                        </div>
                        <p className="mt-6 text-sm">
                            New to RuralStar? <Link href="/register" className="font-semibold text-primary hover:underline">Join now</Link>
                        </p>
                    </div>
                     <div className="mt-8 md:mt-0">
                        <Image
                            src=""//image to be added for front page
                            width={800}
                            height={600}
                            alt="Athlete looking at a laptop"
                            data-ai-hint="athlete laptop"
                            className="rounded-2xl shadow-2xl"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
