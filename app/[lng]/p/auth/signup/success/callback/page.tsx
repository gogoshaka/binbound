'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as UserPublicProfileModel from '@/lib/models/UserPublicProfileModel';

export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        const handleAuthCallback = async () => {
            await UserPublicProfileModel.createUserPublicProfileIfNotExists();
            const referer = localStorage.getItem('referer') || '/';
            localStorage.removeItem('referer');
            router.push(referer);


        };

        handleAuthCallback();
    }, [router]);

    return (
        <div>
            ok
            {/* Loading or success message */}
        </div>
    );
}