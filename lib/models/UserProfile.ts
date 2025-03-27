import z from "zod";

export const compensationSchema = z.object({
    currency: z.enum(["AUD", "BRL", "CAD", "CLP", "COP", "DKK", "CHF", "EUR", "GBP", "HKD", "ILS", "INR", "JPY", "PLN", "USD"]),
    annual_base_salary: z.number().int().positive(),
    last_salary_change: z.number().min(0).max(4),
    annual_bonus: z.number().int().nonnegative(),
  }); 
  
  export const employeerSchema = z.object({
    organization_name: z.string().min(1).max(100),
    parent_company_name: z.string().min(1).max(100),
    organization_seniority: z.number().min(0).max(50),
  }); 
  
  export const businessEmailValidationSchema = z.object({
    business_email: z.string().email(),
  }); 
  export const businessEmailValidationCodeValidationSchema = z.object({
    business_email_validation_code: z.string(),
  }); 
  
  export const personalEmailValidationSchema = z.object({
    personal_email: z.string(),
  }); 
  export const personalEmaillValidationCodeValidationSchema = z.object({
    personal_email_validation_code: z.string(),
  }); 
  
  export type CompensationFormType = z.infer<typeof compensationSchema>;
  export type FlattenedCompensationFormErrorsType = z.inferFlattenedErrors<typeof compensationSchema>;
  
  export type EmployeerFormType = z.infer<typeof employeerSchema>;
  export type FlattenedEmployeerFormErrorsType = z.inferFlattenedErrors<typeof employeerSchema>;
  
  export type BusinessEmailFormType = z.infer<typeof businessEmailValidationSchema>;
  export type BusinessEmailValidationCodeFormType = z.infer<typeof businessEmailValidationCodeValidationSchema>;
  export type PersonalEmailFormType = z.infer<typeof personalEmailValidationSchema>;
  export type PersonalEmailValidationCodeFormType = z.infer<typeof personalEmaillValidationCodeValidationSchema>;
  


export interface UserProfileInterface {
    user_id: string,
    currency: string,
    annual_base_salary: number,
    last_salary_change: number,
    annual_bonus: number,
    organization_name: string,
    parent_company_name: string,
    organization_seniority: number,
    business_email_hash: string,
    business_email_validation_code: string,
    business_email_failed_validation_counter: number
    personal_email: string,
    personal_email_hash: string,
    personal_email_failed_validation_counter: number
}

export class UserProfile implements UserProfileInterface {
    user_id: string;
    currency: string;
    annual_base_salary: number;
    last_salary_change: number;
    annual_bonus: number;
    organization_name: string;
    parent_company_name: string;
    organization_seniority: number;
    business_email_hash: string;
    business_email_failed_validation_counter: number
    business_email_validation_code: string;
    personal_email: string;
    personal_email_hash: string;
    personal_email_failed_validation_counter: number

    static readonly COLLECTION_NAME = 'userprofile';

    constructor(params: {user_id: string, currency: string, annual_base_salary: number, last_salary_change: number, annual_bonus: number, organization_name: string, parent_company_name: string, organization_seniority: number, business_email_hash: string, business_email_validation_code: string, personal_email: string, personal_email_hash: string, business_email_failed_validation_counter: number, personal_email_failed_validation_counter: number}) {
        this.user_id = params.user_id || "";
        this.currency = params.currency;
        this.annual_base_salary = params.annual_base_salary;
        this.last_salary_change = params.last_salary_change;
        this.annual_bonus = params.annual_bonus;
        this.organization_name = params.organization_name;
        this.parent_company_name = params.parent_company_name;
        this.organization_seniority = params.organization_seniority;
        this.business_email_hash = params.business_email_hash;
        this.business_email_validation_code = params.business_email_validation_code;
        this.personal_email = params.personal_email;
        this.personal_email_hash = params.personal_email_hash;
        this.business_email_failed_validation_counter = params.business_email_failed_validation_counter;
        this.personal_email_failed_validation_counter = params.personal_email_failed_validation_counter;
    }

}
