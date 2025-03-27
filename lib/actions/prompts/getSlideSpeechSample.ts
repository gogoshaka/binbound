import { LLMResponseToStudentType, LLMResponseToStudentSchema, LLMResponseToStudentTypeJSON,  LLMRoleType, MessageItemType, SlideSchema, DeckSchema, DeckType } from '@/lib/types/chatCompletionType';


const configuration = {
    //apiKey: "sk-svcacct-QQgqmXNo0duVaxRiKhwev63eCTLDi1gASVtd-18v3StE8T3BlbkFJVGwHSHW9N57uSy5dTuwUdL3HnApjan-Ux0MzsXHOSMOAA",
    apiKey: process.env.OPENAI_API_KEY,
    //dangerouslyAllowBrowser: true 
};


export async function getSlideSpeechSample(slideContent: string, lastContent: string) : Promise<LLMResponseToStudentType|null> {
    const response = await client.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      temperature: 1,
      messages: [
        { role: 'system', content: systemPromptConversationScenario},
        ...chatHistory,
        {role: LLMRoleType.User, content: lastContent},
      ],
      response_format: zodResponseFormat(LLMResponseToStudentSchema, 'llm_response_to_student'),
      });
     
      const content = response.choices[0].message?.parsed;
      console.log(content)
      return content;
}