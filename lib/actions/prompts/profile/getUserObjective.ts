'use server';
import { LLMRoleType, MessageItemType, UserContextAndObjectivesSchema, UserContextAndObjectivesType,   } from '@/lib/types/chatCompletionType';
import { zodResponseFormat } from "openai/helpers/zod";

import OpenAI from "openai";

const configuration = {
    //apiKey: "sk-svcacct-QQgqmXNo0duVaxRiKhwev63eCTLDi1gASVtd-18v3StE8T3BlbkFJVGwHSHW9N57uSy5dTuwUdL3HnApjan-Ux0MzsXHOSMOAA",
    apiKey: process.env.OPENAI_API_KEY,
    //dangerouslyAllowBrowser: true 
};
const openai = new OpenAI(configuration);


const systemPrompt = `
You are interviewing a student in order to understand what are his objectives for learning ${process.env.USER_LEARNING_LANGUAGE}.
- Ask him what his current job is and in which context he has to speak ${process.env.USER_LEARNING_LANGUAGE}.
- Encourage him to be very specific about the context when he speaks ${process.env.USER_LEARNING_LANGUAGE}.
- He has to describe 3 situations where he has to speak ${process.env.USER_LEARNING_LANGUAGE}.
- He has to provide the type of vocabulary he needs to learn or improve in order to speak ${process.env.USER_LEARNING_LANGUAGE}.
`

export async function getUserObjective(chatHistory: MessageItemType[]) : Promise<UserContextAndObjectivesType|null> {
    let translatedSystemPrompt : string | null = systemPrompt;
    if (process.env.USER_NATIVE_LANGUAGE != "english") {
        translatedSystemPrompt = await translateSystemPrompt();
        if (!translatedSystemPrompt) {
            return null;
        }
    }
    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      temperature: 1,
      messages: [
        { role: 'system', content: translatedSystemPrompt},
        ...chatHistory,
      ],
      response_format: zodResponseFormat(UserContextAndObjectivesSchema, 'xx'),
    });
    const content = response.choices[0].message?.parsed;
    return content;
}

async function translateSystemPrompt() {
    const response = await openai.chat.completions.create({
        model: "gpt-4o-2024-08-06",
        temperature: 0,
        messages: [
          { role: 'system', content: `Translate the user input from ${process.env.USER_LEARNING_LANGUAGE} to ${process.env.USER_NATIVE_LANGUAGE}`},
          {role: LLMRoleType.User, content: systemPrompt},
        ],
        });
       
        const content = response.choices[0].message?.content;
        console.log(content)
        return content;

}