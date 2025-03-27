'use client'
import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client'
import { useTranslation } from "@/app/i18n/client";
import SignIn from "@/app/[lng]/user/signin/_containers/SignIn";




export const SignInModal = ({ lng, showSignInModal, message, onClose}: { lng: string, showSignInModal: boolean, message:string, onClose: () => void }) => {
    const { i18n } = useTranslation(lng, 'nav')
    const t = i18n.getFixedT(lng, 'nav')
    const [isSignedId, setIsSignedIn] = useState(false);


    return (
        <div>

        {showSignInModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-300/50 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded shadow-lg relative max-h-[80vh] overflow-y-auto">
                        <button onClick={onClose} className="absolute top-2 right-2">
                            &times;
                        </button>
                        <SignIn lng={lng} message={message}/>
                    </div>
                </div>
            )}
</div>
    )
}