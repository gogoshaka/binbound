'use server';
import { LLMResponseToStudentType, LLMResponseToStudentSchema, LLMResponseToStudentTypeJSON,  LLMRoleType, MessageItemType, SlideSchema, DeckSchema, DeckType } from '@/lib/types/chatCompletionType';
import { revalidatePath } from 'next/cache';
import OpenAI from 'openai';
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import Groq from "groq-sdk";


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const LLM = "GROQ" // OPENAI


const systemPrompt = `
- Evaluate the completeness of the dialog from the user. Provide a number between 0 and 100. 0 means that the user was interrupted before he could finish what he has to say (for example: "I was doing." ). 100 means that the user was not interrupted (for example: "I am doing well, thank you.").
- Don't take into account the dots at the end of the dialog.
- Just provie a number in your response
`




export async function evaluateDialogCompleteness(messageHistory: MessageItemType[], userDialog: string) {
  if (messageHistory.length === 0) {
    return 1;
  }
  const response = await groq.chat.completions.create({
    model: "llama3-70b-8192",
    temperature: 1,
    messages: [
      { role: 'system', content: systemPrompt},
      ...messageHistory,
      {role: LLMRoleType.User, content: userDialog},
    ],
    });
    console.log(response.choices[0]?.message?.content)
    if (!response.choices[0]?.message?.content) {
      return null;
    }
    return response.choices[0]?.message?.content
}


