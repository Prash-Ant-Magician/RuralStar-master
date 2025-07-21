
"use client";

import { useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';

function LoadingScreen() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="space-y-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    )
}

export default function ProfilePage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (user) {
                redirect(`/profile/${user.uid}`);
            } else {
                redirect('/login');
            }
        }
    }, [user, loading, router]);

    return <LoadingScreen />;
}
