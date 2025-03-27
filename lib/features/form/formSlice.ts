import { createAppSlice } from "@/lib/createAppSlice";
import type { AppThunk } from "@/lib/store";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface FormSliceState {
    currency: string,
    annual_base_salary: number,
    last_salary_change: number,
    annual_bonus: number,
    organization_name: string,
    parent_company_name: string,
    organization_seniority: number,
    business_email: string,
    business_email_validation_code: string,
    personal_email: string,
    personal_email_validation_code: string
  }; 
const initialState: FormSliceState = {
    currency: "USD",
    annual_base_salary: 0,
    last_salary_change: 0,
    annual_bonus: 0,
    organization_name: "",
    parent_company_name: "",
    organization_seniority: 0,
    business_email: "",
    business_email_validation_code: "",
    personal_email: "",
    personal_email_validation_code: ""
  };

  export const formSlice = createAppSlice({
    name: "form",
    initialState,
    reducers: (create) => ({
        setCurrency: create.reducer((state, action: PayloadAction<string>) => {
          // Redux Toolkit allows us to write "mutating" logic in reducers. It
          // doesn't actually mutate the state because it uses the Immer library,
          // which detects changes to a "draft state" and produces a brand new
          // immutable state based off those changes
          state.currency = action.payload;
        }),
        setAnnualBaseSalary: create.reducer((state, action: PayloadAction<number>) => {
            state.annual_base_salary = action.payload;
        }),
        setLastSalaryChange: create.reducer((state, action: PayloadAction<number>) => {
            state.last_salary_change = action.payload;
        }),
        setAnnualBonus: create.reducer((state, action: PayloadAction<number>) => {
            state.annual_bonus = action.payload;
        }),
        setOrganizationName: create.reducer((state, action: PayloadAction<string>) => {
            state.organization_name = action.payload;
        }),
        setParentCompanyName: create.reducer((state, action: PayloadAction<string>) => {
            state.parent_company_name = action.payload;
        }),
        setOrganizationSeniority: create.reducer((state, action: PayloadAction<number>) => {
            state.organization_seniority = action.payload;
        }),
        setBusinessEmail: create.reducer((state, action: PayloadAction<string>) => {
            state.business_email = action.payload;
        }),
        setBusinessEmailValidationCode: create.reducer((state, action: PayloadAction<string>) => {
            state.business_email_validation_code = action.payload;
        }),
        setPersonalEmail: create.reducer((state, action: PayloadAction<string>) => {
            state.personal_email = action.payload;
        }),
        setPersonalEmailValidationCode: create.reducer((state, action: PayloadAction<string>) => {
            state.personal_email_validation_code = action.payload;
        })
    }),
    selectors: {
        selectCurrency: (counter) => counter.currency,
        selectAnnualBaseSalary: (counter) => counter.annual_base_salary,
        selectLastSalaryChange: (counter) => counter.last_salary_change,
        selectAnnualBonus: (counter) => counter.annual_bonus,
        selectOrganizationName: (counter) => counter.organization_name,
        selectParentCompanyName: (counter) => counter.parent_company_name,
        selectOrganizationSeniority: (counter) => counter.organization_seniority,
        selectBusinessEmail: (counter) => counter.business_email,
        selectBusinessEmailValidationCode: (counter) => counter.business_email_validation_code,
        selectPersonalEmail: (counter) => counter.personal_email,
        selectPersonalEmailValidationCode: (counter) => counter.personal_email_validation_code
      },
  });
  export const { setCurrency } = formSlice.actions;
  export const { selectCurrency } = formSlice.selectors;
    export const { setAnnualBaseSalary } = formSlice.actions;
    export const { selectAnnualBaseSalary } = formSlice.selectors;
    export const { setLastSalaryChange } = formSlice.actions;
    export const { selectLastSalaryChange } = formSlice.selectors;
    export const { setAnnualBonus } = formSlice.actions;
    export const { selectAnnualBonus } = formSlice.selectors;
    export const { setOrganizationName } = formSlice.actions;
    export const { selectOrganizationName } = formSlice.selectors;
    export const { setParentCompanyName } = formSlice.actions;
    export const { selectParentCompanyName } = formSlice.selectors;
    export const { setOrganizationSeniority } = formSlice.actions;
    export const { selectOrganizationSeniority } = formSlice.selectors;
    export const { setBusinessEmail } = formSlice.actions;
    export const { selectBusinessEmail } = formSlice.selectors;
    export const { setBusinessEmailValidationCode } = formSlice.actions;
    export const { selectBusinessEmailValidationCode } = formSlice.selectors;
    export const { setPersonalEmail } = formSlice.actions;
    export const { selectPersonalEmail } = formSlice.selectors;