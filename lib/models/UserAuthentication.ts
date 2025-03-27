import jwt, { Jwt } from 'jsonwebtoken';
import { MongoClient } from 'mongodb';
 

export interface UserAuthenticationInterface {
    user_id: string,
    created_at: number,
    personal_email: string,
    personal_email_hash: string,
    token: string,
    last_login: number,
    token_expiry: number,
    failed_login_counter: number,
    total_failed_login_counter: number,
    login_blocked: boolean,
    login_blocked_until: number,
    successful_login_counter: number,
}

export class UserAuthentication implements UserAuthenticationInterface {
    user_id: string;
    created_at: number;
    personal_email: string;
    personal_email_hash: string;
    token: string;
    last_login: number;
    token_expiry: number;
    failed_login_counter: number;
    total_failed_login_counter: number;
    login_blocked: boolean;
    login_blocked_until: number;
    successful_login_counter: number;

    static readonly  MAX_LOGIN_ATTEMPTS = 5;
    static readonly  JWT_EXPIRATION_DAYS = 365;

    constructor(params: {user_id: string, created_at: number, personal_email: string, personal_email_hash: string, token: string, last_login: number, token_expiry: number, failed_login_counter: number,total_failed_login_counter:number, login_blocked: boolean, login_blocked_until: number, successful_login_counter: number}) {
        this.user_id = params.user_id;
        this.created_at = params.created_at;
        this.personal_email = params.personal_email;
        this.personal_email_hash = params.personal_email_hash;
        this.token = params.token;
        this.last_login = params.last_login;
        this.token_expiry = params.token_expiry;
        this.failed_login_counter = params.failed_login_counter;
        this.total_failed_login_counter = params.total_failed_login_counter;
        this.login_blocked = params.login_blocked;
        this.login_blocked_until = params.login_blocked_until;
        this.successful_login_counter = params.successful_login_counter;
    }


    authenticate(authtoken: string | null ) : string | null {
        if (authtoken == null) {
            return null
        }
        if (this.failed_login_counter >  UserAuthentication.MAX_LOGIN_ATTEMPTS) {
            return null;
        }
        if (this.token_expiry <  Date.now()) {
            return null;
        }
        if (this.token != authtoken) {
            return null;
        }
        return jwt.sign({ user_id: this.user_id }, process.env.JWT_SECRET!, { expiresIn: `${UserAuthentication.JWT_EXPIRATION_DAYS}d` }) ;
    }
}