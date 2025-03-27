'use server';
import { LLMResponseToStudentType, LLMResponseToStudentSchema, LLMResponseToStudentTypeJSON,  LLMRoleType, MessageItemType, SlideSchema, DeckSchema, DeckType } from '@/lib/types/chatCompletionType';

import OpenAI from "openai";

const configuration = {
    //apiKey: "sk-svcacct-QQgqmXNo0duVaxRiKhwev63eCTLDi1gASVtd-18v3StE8T3BlbkFJVGwHSHW9N57uSy5dTuwUdL3HnApjan-Ux0MzsXHOSMOAA",
    apiKey: process.env.OPENAI_API_KEY,
    //dangerouslyAllowBrowser: true 
};
const client = new OpenAI(configuration);


const systemPrompt = `
    Rephrase the last dialog from the user in a more professional manner using a good level of English.
`;


export async function getRephrase(chatHistory: MessageItemType[], lastContent: string) : Promise<string|null> {
    const response = await client.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      temperature: 1,
      messages: [
        { role: 'system', content: systemPrompt},
        ...chatHistory,
        {role: LLMRoleType.User, content: lastContent},
      ]
      });  
      const content = response.choices[0].message?.content;
      console.log(content)
      return content;
}
