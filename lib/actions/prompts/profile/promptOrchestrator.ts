'use server';
import { MessageItemType, UserContextAndObjectivesType } from '@/lib/types/chatCompletionType';

import OpenAI from "openai";


const configuration = {
    //apiKey: "sk-svcacct-QQgqmXNo0duVaxRiKhwev63eCTLDi1gASVtd-18v3StE8T3BlbkFJVGwHSHW9N57uSy5dTuwUdL3HnApjan-Ux0MzsXHOSMOAA",
    apiKey: process.env.OPENAI_API_KEY,
    //dangerouslyAllowBrowser: true 
};
const client = new OpenAI(configuration);


const systemPrompt = `
    Rephrase the last dialog from the user in a more professional way
`;


export async function orchestrateResponseToStudent(chatHistory: MessageItemType[], lastContent: string, dialog_index: number) : Promise<UserContextAndObjectivesType|null> {
    const [nextDialog, corrections, rephrased, userDialogCompletenessProbability] = await Promise.all([
        getNextDialog(chatHistory, lastContent),
        getCorrections(lastContent),
        // return only the last 6 elements of the chat history, it's enough to set the context
        getRephrase(chatHistory.slice(-6), lastContent),
        evaluateDialogCompleteness(chatHistory.slice(-6), lastContent)
    ]);
    if (nextDialog != null && corrections != null && rephrased != null) {
        return {
            dialog: nextDialog,
            corrections: corrections,
            dialog_rephrase: rephrased,
            dialog_completeness_probability: userDialogCompletenessProbability,
            response_index: dialog_index + 1

        }
    }
    else {
        return null;
    }
}