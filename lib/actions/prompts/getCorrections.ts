'use server';
import { LLMResponseToStudentType, LLMResponseToStudentSchema, LLMResponseToStudentTypeJSON,  LLMRoleType, MessageItemType, SlideSchema, DeckSchema, DeckType, CorrectionSchema, CorrectionType } from '@/lib/types/chatCompletionType';
import { zodResponseFormat } from "openai/helpers/zod";

import OpenAI from "openai";

const configuration = {
    //apiKey: "sk-svcacct-QQgqmXNo0duVaxRiKhwev63eCTLDi1gASVtd-18v3StE8T3BlbkFJVGwHSHW9N57uSy5dTuwUdL3HnApjan-Ux0MzsXHOSMOAA",
    apiKey: process.env.OPENAI_API_KEY,
    //dangerouslyAllowBrowser: true 
};
const openai = new OpenAI(configuration);


const systemPrompt = `
Propose corrections based on syntax. Also:
- Don't correct politeness
- Don't correct punctuation
- Don't correct repeated words
- Don't correct anything related to the writing as what you read has been transcribed from speech.
- Don't correct the style as it's an oral conversation
- Return the correct_answer embedded in a <span> tag. The part that has been corrected should be put between <b> tags and uppercase.
- If no correction is needed, return an empty array
`

export async function getCorrections(input: string) : Promise<CorrectionType[]|null> {
    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      temperature: 1,
      messages: [
        { role: 'system', content: systemPrompt},
        {role: LLMRoleType.User, content: input},
      ],
      response_format: zodResponseFormat(CorrectionSchema, 'corrections'),
      });
     
      const content = response.choices[0].message?.parsed;
      console.log(content)
      return content ? [content] : null;
}