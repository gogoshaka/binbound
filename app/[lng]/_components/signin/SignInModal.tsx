'use client'
import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client'
import { useTranslation } from "@/app/i18n/client";
import SignIn from "@/app/[lng]/user/signin/_containers/SignIn";

import { useStore } from "@/lib/store/store";



export const SignInModal = ({ lng}: { lng: string}) => {
    const { i18n } = useTranslation(lng, 'nav')
    const t = i18n.getFixedT(lng, 'nav')

    const { showSignInModal, setShowSignModal } = useStore((state) => ({
        showSignInModal: state.showSignInModal,
        setShowSignModal: state.setShowSignModal
    }));


    return (
        <div>

        {showSignInModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-300/50 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded shadow-lg relative max-h-[80vh] overflow-y-auto">
                        <button onClick={() => setShowSignModal(false)} className="absolute top-2 right-2">
                            &times;
                        </button>
                        <SignIn lng={lng} message={''}/>
                    </div>
                </div>
            )}
</div>
    )
}