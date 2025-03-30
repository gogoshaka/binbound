

import { useTranslation } from "@/app/i18n/client";
import QuestionActions from "./QuestionActions";
import * as EventModel from "@/lib/models/EventModel";

export type QuestionProps = {
    lng: string;
    question: EventModel.QuestionWithaskedByUserPublicProfileType;
};
export default function ({lng, question} : QuestionProps) {
    const { t } = useTranslation(lng, 'ama');

    // function that returns how long ago the question was asked. After one year, the exact date is shown. the time is stored in UTC format
    const timeAgo = (date: Date) => {
        const now = new Date();
        const diff = Math.abs(now.getTime() - date.getTime());
        const diffInMinutes = Math.floor(diff / (1000 * 60));
        const diffInHours = Math.floor(diff / (1000 * 60 * 60));
        const diffInDays = Math.floor(diff / (1000 * 60 * 60 * 24));
        const diffInWeeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));

        if (diffInMinutes < 60) {
            return `${diffInMinutes} minutes ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours} hours ago`;
        } else if (diffInDays < 7) {
            return `${diffInDays} days ago`;
        } else if (diffInWeeks < 52) {
            return `${diffInWeeks} weeks ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    return (
        <div className="flex flex-col border-b border-gray-200 py-4">
            <div className="flex items-center">
                <div className="text-sm font-semibold">{question.askedByUserPublicProfile.name}</div>
                <div className="text-xs text-gray-500 ml-2">
                    {timeAgo(new Date(question.askedAtUTC))}
                </div>
            </div>
            <div className="mt-2 text-gray-700">{question.question}</div>
            <div>
                <QuestionActions lng={lng} questionId={question.id} />
            </div>
        </div>
    )

}