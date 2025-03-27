

'use client'
import { SignInModal } from "@/app/[lng]/_components/signin/SignInModal";
import { useTranslation } from "@/app/i18n/client";
import { authClient } from "@/lib/auth-client";
import { useStore } from "@/lib/store/store";
import { Question } from "@prisma/client";
import { Sign } from "crypto";
import { use, useEffect, useState, useRef } from "react";
import { useShallow } from "zustand/react/shallow";


export default function ({lng, questionId} : {lng: string; questionId: string}) {
    const { t } = useTranslation(lng, 'ama');

    const { voteQuestion } = useStore((state) => ({
        voteQuestion: state.voteQuestion,
    }));


    return (
            <div>
                <button 
                    onClick={() => voteQuestion(questionId)}
                    className="mt-2 rounded-full bg-transparent cursor-pointer flex items-center hover:fill-purple fill-black"
                    >
                    <svg  height="16" icon-name="upvote-outline" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg"> <path d="M10 19c-.072 0-.145 0-.218-.006A4.1 4.1 0 0 1 6 14.816V11H2.862a1.751 1.751 0 0 1-1.234-2.993L9.41.28a.836.836 0 0 1 1.18 0l7.782 7.727A1.751 1.751 0 0 1 17.139 11H14v3.882a4.134 4.134 0 0 1-.854 2.592A3.99 3.99 0 0 1 10 19Zm0-17.193L2.685 9.071a.251.251 0 0 0 .177.429H7.5v5.316A2.63 2.63 0 0 0 9.864 17.5a2.441 2.441 0 0 0 1.856-.682A2.478 2.478 0 0 0 12.5 15V9.5h4.639a.25.25 0 0 0 .176-.429L10 1.807Z"></path> </svg>
                    </button>
            </div>
    )

}