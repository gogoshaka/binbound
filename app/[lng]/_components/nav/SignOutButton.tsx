'use client'
import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client'
import { useTranslation } from "@/app/i18n/client";
import SignIn from "@/app/[lng]/user/signin/_containers/SignIn";




export const SignOutButton = ({ lng}: { lng: string }) => {
    const { i18n } = useTranslation(lng, 'nav')
    const t = i18n.getFixedT(lng, 'nav')
    const [isSignedId, setIsSignedIn] = useState(false);
    const [showSignInModal, setShowSignInModal] = useState(false);

    const signOut = () => {
        authClient.signOut().then(() => {
            setIsSignedIn(false);
    })}
    const { 
        data: session, 
        isPending, //loading state
        error, //error object
        refetch //refetch the session
    } = authClient.useSession()

    const openSignInModal = () => {
        setShowSignInModal(true);
    };

    const closeSignInModal = () => {
        setShowSignInModal(false);
    };

    return (
        <div>
        {session && !isPending ? (
        <button onClick={signOut}>
            Sign Out
        </button>
        ) : 
        <button onClick={openSignInModal}>
            {t('sign_in')} | {t('sign_up')}
        </button>
}

        {showSignInModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-300/50 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded shadow-lg relative max-h-[80vh] overflow-y-auto">
                        <button onClick={closeSignInModal} className="absolute top-2 right-2">
                            &times;
                        </button>
                        <SignIn lng={lng}/>
                    </div>
                </div>
            )}
</div>
    )
}