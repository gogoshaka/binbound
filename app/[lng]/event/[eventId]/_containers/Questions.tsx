
'use client'

import { useTranslation } from "@/app/i18n/client";
import { authClient } from "@/lib/auth-client";
import { useStore } from "@/lib/store/store";
import { use, useEffect, useState, useRef } from "react";
import QuestionItem from "./QuestionItem";

export type QuestionsProps = {
    lng: string;
    eventId: string;
};
export default function ({lng, eventId} : QuestionsProps) {
    const { t } = useTranslation(lng, 'ama');

    const { questions, fetchQuestions, askQuestion, voteQuestion } = useStore((state) => ({
        questions: state.questions,
        fetchQuestions: state.fetchQuestions,
        askQuestion: state.askQuestion,
        voteQuestion: state.voteQuestion,
    }));
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [newQuestion, setNewQuestion] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [showAskQuestion, setShowAskQuestion] = useState(false);
    const [buttonHoverColor, setButtonHoverColor] = useState('black');
    const [showNotification, setShowNotification] = useState(false);

    const { 
      data: session, 
      isPending, //loading state
      error, //error object
      refetch //refetch the session
  } = authClient.useSession()



     useEffect(() => {
        fetchQuestions(eventId);
      }, [fetchQuestions, eventId]);

      const submitQuestion = async () => {
        setShowNotification(true);

        await askQuestion(eventId, newQuestion);
        setNewQuestion('');
        setIsEditing(false);
        
    };

      const handleCancel = () => {
        setNewQuestion('');
        setIsEditing(false);
    };

    const showQuestionInput = () => {
      if (!session) {
        // setShowSignInModal(true)
        return
      }
      setShowAskQuestion(true);
    }

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNewQuestion(e.target.value);
      if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
  };

      return (
        <div className="w-full">
          <div>
          <div className="flex justify-center mt-4">
            <button 
              onClick={() => showQuestionInput()}
              className="rounded-md font-bold uppercase bg-transparent border-2 border-black px-4 py-2 cursor-pointer transition-colors hover:bg-black hover:bg-opacity-10 hover:text-white"
            >
              {t('ask_a_question')}
            </button>
          </div>
        {showAskQuestion && (
            <div className={`w-full p-2 border border-gray-300 ${isFocused ? 'border-2 border-gray-700' : 'border-1'} rounded mb-2`}>
            <textarea
                            ref={textareaRef}
                            value={newQuestion}
                            onChange={handleInput}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder={t('Type your question here')}
                            className="w-full p-2 border-none rounded mb-2 resize-none overflow-hidden focus:outline-none"
                            rows={2}
                        />
                        <div className="flex space-x-2">
                            <button 
                                onClick={submitQuestion}
                                className="rounded-full font-bold uppercase bg-transparent border-2 text-sm border-black px-2 py-1 cursor-pointer transition-colors hover:bg-black hover:bg-opacity-10 hover:text-white"
                                >
                                {t('submit')}
                            </button>
                            <button 
                                onClick={() => setShowAskQuestion(false)}
                                className="rounded-full font-bold uppercase bg-transparent border-2 text-xs border-black px-2 py-1 cursor-pointer transition-colors hover:bg-black hover:bg-opacity-10 hover:text-white"
                                >
                                {t('cancel')}
                            </button>
                        </div>
                    </div>
        )}

{showNotification && (
          <div className="mt-4 mb-4 p-4 bg-green-100/50 bg-opacity-50 flex justify-between items-center rounded-xs">
            <span>{t('your_question_has_been_successfully_submitted_it_will_be_displayed_after_validation')}</span>
            <button onClick={() => setShowNotification(false)} className="ml-4 text-red-600 cursor-pointer">
              <svg  height="16" icon-name="close-outline" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg"> <path d="M10.707 10l4.646-4.646a1 1 0 0 0-1.414-1.414L9.293 8.586 4.646 3.94a1 1 0 1 0-1.414 1.414L8.586 10l-4.646 4.646a1 1 0 1 0 1.414 1.414L9.293 11.414l4.646 4.646a1 1 0 0 0 1.414-1.414L10.707 10Z"></path> </svg>
            </button>
          </div>
        )}
          </div>

          <div>
            <h2>{t('Pending Questions')}</h2>
            {questions.map((question) => (
              <QuestionItem key={question.id} question={question} lng={lng} />
            ))}
          </div>

          <div>
  </div>



        </div>
      );
}




