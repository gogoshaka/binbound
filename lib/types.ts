
export type APIState =
  | {
      status: "success";
      message: string;
    }
  | {
      status: "error";
      message: string;
      errors?: Array<{
        path: string;
        message: string;
      }>;
    }
  | null;


export type AuthenticationType =
 {
    user_id: string,
    created_at: number,
    personal_email: string,
    personal_email_hash: string,
    token: string,
    last_login: number,
    token_expiry: number,
    login_attempt_counter: number,
    login_blocked: boolean,
    login_blocked_until: number,
    successful_login_counter: number,
};

export const getInitAuthenticationParams = (): AuthenticationType => {
    return {
        user_id: "",
        created_at: 0,
        personal_email: "",
        personal_email_hash: "",
        token: "",
        last_login: 0,
        token_expiry: 0,
        login_attempt_counter: 0,
        login_blocked: false,
        login_blocked_until: 0,
        successful_login_counter: 0
}};

export type PermissionType = {
  age_allowed: boolean;
  ethnicity_allowed: boolean;
  level_allowed: boolean;
};

