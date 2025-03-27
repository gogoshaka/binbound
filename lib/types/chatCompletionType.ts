import { object, z } from "zod";



export enum LLMRoleType {
    User = 'user',
    Assistant = 'assistant',
  }
export type RoleType = LLMRoleType;

export type MessageItemType = {
    content: string;
    role: RoleType;
    corrections?: CorrectionType[];
  }; 

export const CorrectionSchema = z.object({
  student_said: z.string(),
  correct_answer: z.string(),
  explanation: z.string()
})
export type CorrectionType = z.infer<typeof CorrectionSchema>;


export const LLMResponseToStudentSchema = z.object({
  dialog: z.string(),
  dialog_rephrase: z.string(),
  corrections: z.array(CorrectionSchema),
  dialog_completeness_probability: z.number(),
  response_index: z.number(),
  //follow_up_dialog_hints: z.array(z.string())
});

export type LLMResponseToStudentType = z.infer<typeof LLMResponseToStudentSchema>;

export const LLMResponseToStudentTypeJSON = `
{
dialog: <dialog from LLM>,
corrections: [
{ studant_saids: <what the student said>, correct_answer: <correct answer>, explanation: <explanation> }
],
follow_up_dialog_hints: []
}
`

export const UserContextAndObjectivesSchema = z.object({
  job_title: z.string(),
  objective: z.array(z.string()),
  language_usage_situation_1: z.string(),
  language_usage_situation_2: z.string(),
  language_usage_situation_3: z.string(),
  next_dialog: z.string(),
});
export type UserContextAndObjectivesType = z.infer<typeof UserContextAndObjectivesSchema>;

export const SlideSchema = z.object({
  title: z.string(),
  bullet_1: z.string(),
  bullet_2: z.string(),
  bullet_3: z.string(),
  bullet_4: z.string(),
  prompt_for_illustration_generation: z.string().optional()
});

export type SlideType = z.infer<typeof SlideSchema>;

export const DeckSchema = z.object({
  slides: z.array(SlideSchema)
});

export type DeckType = z.infer<typeof DeckSchema>;