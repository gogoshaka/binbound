import { MongoClient } from "mongodb";
import { UserAuthentication, UserAuthenticationInterface } from "../models/UserAuthentication";


export class UserAuthenticationService {
    private static instance: UserAuthenticationService;
    private constructor() { }

    public static getInstance(): UserAuthenticationService {
        if (!UserAuthenticationService.instance) {
            UserAuthenticationService.instance = new UserAuthenticationService();
        }

        return UserAuthenticationService.instance;
    }

    /**
     * 
     * @param emailhash 
     * @param authtoken 
     * @returns a JWT token if the authtoken is valid, null otherwise
     */
    public async authenticateUser(emailhash: string, authtoken: string): Promise<string | null> {
        if (!emailhash || emailhash.length > 1000) {
            return null;
        }
        if (!authtoken) {
            return null;
        }
        let client: MongoClient | null = null;
        let jwt = null;
        try {
            client = new MongoClient(process.env.MONGODB_URI!);
            await client.connect();
            const database = client.db('compensation'); 
            const collection = database.collection('authentication');
            let result : UserAuthenticationInterface | null = await collection.findOne({ personal_email_hash: emailhash}, {projection: {_id: 0}}) as UserAuthenticationInterface | null;
            if (result) {
                const userAuthentication = new UserAuthentication(result);
                jwt = userAuthentication.authenticate(authtoken);
                if (jwt != null) {
                    // successful authentication
                    await collection.updateOne({ personal_email_hash: emailhash}, {$inc: {success_login_counter: 1}, $set: {last_login_at: Date.now(),failed_login_counter: 0}});
                } else {
                    // failed to authenticate
                    await collection.updateOne({ personal_email_hash: emailhash}, {$inc: {failed_login_counter: 1, total_failed_login_counter: 1}});
                }
            }
            } catch (error) {
                return null;
            }
            finally {  
                if (client) {
                    await client.close();
                }
                return jwt;
            }
        }
}