'use server';
import { LLMResponseToStudentType, LLMResponseToStudentSchema, LLMResponseToStudentTypeJSON,  LLMRoleType, MessageItemType, SlideSchema, DeckSchema, DeckType } from '@/lib/types/chatCompletionType';
import { revalidatePath } from 'next/cache';
import OpenAI from 'openai';
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import Groq from "groq-sdk";




const configuration = {
    //apiKey: "sk-svcacct-QQgqmXNo0duVaxRiKhwev63eCTLDi1gASVtd-18v3StE8T3BlbkFJVGwHSHW9N57uSy5dTuwUdL3HnApjan-Ux0MzsXHOSMOAA",
    apiKey: process.env.OPENAI_API_KEY,
    //dangerouslyAllowBrowser: true 
};
const client = new OpenAI(configuration);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const LLM = "GROQ" // OPENAI

/*
const systemPromptContent = `
You are teaching English and you are leading a conversation with a student. 
Ask open and simple questions. Make your questions and answers short. 
Propose correction (only on the last dialog from the user) based on syntax. Also:
- Don't correct politeness
- Don't correct punctuation
- Don't correct anything related to the writing as what you read has been transcribed from speech.

You must reply in a JSON format like this:
{
  "dialog": "<your direct reply to what the user has said>",
  "user_dialog_completed": <the probablity that the user input is completed - number between 0 and 1>,
  "corrections": [
    {
      "student_said": "<the student said>",
      "correct_answer": "<the correct answer>",
      "explanation": "<the explanation>"
    }
  ]
}.
If not corrections is needed, corrections is an empty array.
If you do not follow this format, you will be penalized.
`;
*/

const systemPromptSupportDocument = `
Generate 15 slides related to the report of a cybersecurity audit. The bullet points should mention the findings and the recommendations of the audit. It should be very speciif based on plausible real life findings.
`;

/*
const systemPromptConversationScenario = `
You are teaching English and you are leading a conversation with a student. 
Ask open and simple questions. Make your questions and answers short. 
The conversation you're having with the student is based on a role playing game:
- the student is a cyber security expert 
- you are the manager of the company
The cyber security expert is delivering the restitution of a cyber security audit to your company. He has to explain the findings and the recommendations.
The manager asks questions about the audit.
Propose corrections (only on the last dialog from the user) based on syntax. Also:
- Don't correct politeness
- Don't correct punctuation
- Don't correct anything related to the writing as what you read has been transcribed from speech.
- Don't correct the style as it's an oral conversation
Propose also 2 possible follow-up dialog hints that the cyber security expert can say to continue the conversation. Don't make complete sentence for the hints. Provide very specific hints. For example: "You can talk about the misconfiguration of the Nginx server"
`;
*/



const systemPromptConversationScenario = `
- You are an english teacher and you are teaching english to a student. 
- You are involved with a role playing game with a student.
- In this game, you are the manager of the company audited by a cybersecurity consultant
- The student is a cybersecurity consultant (you are not the cybersecurity consultant)
- If what the cybersecurity consultant says is not clear or is not accurate enough to you, you can ask questions to clarify the information or to ask for more details.
- If you don't understand the input, it's probably because the student made an english mistahe. Try to make hypothesis about what the student meant.



`;
// Propose also 2 possible follow-up dialog hints that the cybersecurity expert can say to continue the conversation. Don't make complete sentence for the hints. Provide very specific hints. For example: "You can talk about the misconfiguration of the Nginx server"

export async function getNextDialog(chatHistory: MessageItemType[], lastContent: string) : Promise<string|null> {
  if (LLM === "OPENAI") {
    return getOpenAIchatCompletion(chatHistory, lastContent);
  }
  else {
    return getGroqChatCompletion(chatHistory, lastContent);
  }
}


export async function getOpenAIchatCompletion(chatHistory: MessageItemType[], lastContent: string) : Promise<string|null> {
    const response = await client.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      temperature: 1,
      messages: [
        { role: 'system', content: systemPromptConversationScenario},
        ...chatHistory,
        {role: LLMRoleType.User, content: lastContent},
      ],
      });
      const content = response.choices[0].message?.content;
      console.log(content)
      return content;
}




export const generateSupportDocument = async () : Promise<DeckType | null> => {
  const response = await client.beta.chat.completions.parse({
      model: 'gpt-4o-2024-08-06',
      temperature: 1,
      messages: [
        { role: 'system', content: systemPromptSupportDocument},
      ],
      response_format: zodResponseFormat(DeckSchema, 'deck'),
      });
     
      const content = response.choices[0].message?.parsed;
      return content;
}



export async function evaluateSentenceCompleteness(messageHistory: MessageItemType[], userDialog: string) {
  if (messageHistory.length === 0) {
    return 1;
  }
  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0,
    messages: [
      { role: 'system', content: "given the provided dialog, evaluate the probablity that the dialog from the user was not interrupted. Interrupted dialogs are sentences where a word or an expression is missing at the end of the dialog. Just provide a number between 0 and 1."},
      { ...messageHistory[messageHistory.length - 1]}, // provide the last dialog of the conversation
      {role: LLMRoleType.User, content: userDialog},
    ],
    });
   
    const content = response.choices[0].message?.content;
    return content;


}






export async function getGroqChatCompletion(chatHistory: MessageItemType[], lastContent: string) : Promise<string|null> {
  const sampleResponse : LLMResponseToStudentType = {} as LLMResponseToStudentType;
  console.log(sampleResponse)
  // interpolate systemPromptConversationScenario

  const response = await groq.chat.completions.create({
    model: "llama3-70b-8192",
    temperature: 1,
    messages: [
      { role: 'system', content: systemPromptConversationScenario},
      ...chatHistory,
      {role: LLMRoleType.User, content: lastContent},
    ],
    });
    console.log(response.choices[0]?.message?.content)
    if (!response.choices[0]?.message?.content) {
      return null;
    }
    return response.choices[0]?.message?.content
    //parse zodResponseFormat(LLMResponseToStudentSchema, 'llm_response_to_student'),
}