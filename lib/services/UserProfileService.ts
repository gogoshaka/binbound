'use server'
import { cookies } from 'next/headers';

import { MongoClient, Binary } from 'mongodb';
import { compensationSchema, CompensationFormType, FlattenedCompensationFormErrorsType,employeerSchema, EmployeerFormType, FlattenedEmployeerFormErrorsType, UserProfile  } from "../models/UserProfile"
import { createHash, randomInt } from 'crypto';
import { anonymoussessionidCookie } from '@/lib/cookies';
import { EmailService } from './EmailService';


export type createCompensationDataReturnType =
  {
      status: "success";
      message: string;
    }
  | {
      status: "error";
      message: string;
      errors?: FlattenedCompensationFormErrorsType
    };

export async function createCompensationData(formData: CompensationFormType): Promise<createCompensationDataReturnType> {
    const result = compensationSchema.safeParse(formData)
    if (!result.success) {
        return( {
            status: "error",
            message: "Invalid form data",
            errors: result.error.flatten(),
        })
    }    

    const client = new MongoClient(process.env.MONGODB_URI!, {
      pkFactory: { createPk: () =>  new (crypto.randomUUID() as any) }
    });
    let res : createCompensationDataReturnType = {
        status: "success",
        message: "Data saved successfully",
      };
    try {
      let profileId: Binary = new Binary(Buffer.from(cookies().get(anonymoussessionidCookie.name)!.value), Binary.SUBTYPE_UUID);
      console.log('profile id'+profileId)
      await client.connect();
        const database = client.db('compensation');
        const collection = database.collection(UserProfile.COLLECTION_NAME);
        await collection.updateOne(
          {_id: profileId}, 
          { $set :{_id: profileId, ...formData} },
          { upsert: true });
      } catch (error) {
        console.log(error)
        res =  {
            status: "error",
            message: "Error saving data",
        }
      } finally {
        await client.close();
      }
      return res;
    } 
    



export type createEmployeerDataReturnType =
  {
      status: "success";
      message: string;
    }
  | {
      status: "error";
      message: string;
      errors?: FlattenedEmployeerFormErrorsType
    };

export async function createEmployeerData(formData: EmployeerFormType): Promise<createEmployeerDataReturnType> {
  console.log('db here')

    const result = employeerSchema.safeParse(formData)

    if (!result.success) {
        console.log(result.error.flatten())
        return( {
            status: "error",
            message: "Invalid form data",
            errors: result.error.flatten(),
        })
    }    

    const client = new MongoClient(process.env.MONGODB_URI!);
    let res : createEmployeerDataReturnType = {
        status: "success",
        message: "Data saved successfully",
      };
    try {
        let profileId: Binary = new Binary(Buffer.from(cookies().get(anonymoussessionidCookie.name)!.value), Binary.SUBTYPE_UUID);
        console.log('profile id'+profileId)
        console.log(UserProfile.COLLECTION_NAME)
        await client.connect();
        const database = client.db('compensation'); // Choose a name for your database
        const collection = database.collection(UserProfile.COLLECTION_NAME); // Choose a name for your collection
        const at = await collection.updateOne(
          { _id: profileId }, 
          { $set: { ...formData }}
        );
        console.log(at)
      } catch (error) {
        console.log(error)
        res =  {
            status: "error",
            message: "Error saving data",
        }
      } finally {
        await client.close();
      }
      return res;
    } 


export async function sendValidationCodeToBusinessEmail({business_email}: {business_email:string}): Promise<{status: 'success' | 'error'}> {
    const validationCode = generateRandomCode();
    try {
      let res = await EmailService.getInstance().sendEmail({
        from: process.env.NOREPLY_EMAIL_SENDER!,
        to: business_email,
        subject: validationCode,
        body: ""
      });
      if (res) {
        return persistBusinessEmail({ business_email_validation_code: validationCode, business_email});
      } else {
        return {status: 'error'};
      }
    }
    catch (error) {
      return {status: 'error'};
    }
}

export async function sendValidationCodeToPersonalEmail({personal_email}: {personal_email:string}): Promise<{status: 'success' | 'error'}> {
  return persistPersonalEmail({personal_email, personal_email_validation_code: Buffer.from(hashString(crypto.randomUUID()), 'utf8').toString('base64')});
} 

export async function checkValidationCodeForBusinessEmail(params: {business_email: string, business_email_validation_code: string}): Promise<{status: 'success' | 'error', found:boolean}> {
  const client = new MongoClient(process.env.MONGODB_URI!);
  let res : {status: "success" | "error", found: boolean} = {
      status: "success",
      found: false
    };
    console.log(params)
    let paramsToCheck : any = {...params};
    paramsToCheck.business_email_hash = hashString(params.business_email);
    try {
        await client.connect();
        const database = client.db('compensation'); // Choose a name for your database
        const collection = database.collection(UserProfile.COLLECTION_NAME); // Choose a name for your collection
        let result = await collection.findOne({ business_email_hash: paramsToCheck.business_email_hash});
        if (result != null) {
          if (result.business_email_validation_code === params.business_email_validation_code && result.business_email_failed_validation_counter < 5) {
            res.found = true;
            await collection.updateOne(
              { business_email: paramsToCheck.business_email}, 
              { $set: { business_email_validated: true } }
            );
          }
          if (result.business_email_validation_code === params.business_email_validation_code) {
            await collection.updateOne(
              { business_email: paramsToCheck.business_email}, 
              { $inc: { business_email_failed_validation_counter: 1 } }
            );
          }
        }
    } catch (error) {
      res.status =  "error"
    } finally {
      await client.close();
    }
    return res;
}


async function persistBusinessEmail(params: { business_email: string, business_email_validation_code: string}): Promise<{status: 'success' | 'error'}> {
  const client = new MongoClient(process.env.MONGODB_URI!);
  let res : {status: "success" | "error"} = {
      status: "success",
    };
  // business emails should not bet stored twice
  // TO DO: enforce this check while preserving confidentiality

  
  let paramsToPersist : any = {...params};
  paramsToPersist.business_email_failed_validation_counter = 0;
  paramsToPersist.business_email_validated = false;
  paramsToPersist.business_email_validation_blocked = false;
  paramsToPersist.business_email_validation_blocked_until = null;
  paramsToPersist.persisted_at = Date.now();
  paramsToPersist.business_email_hash = hashString(params.business_email);
  paramsToPersist.business_email_domain = extractDomain(params.business_email.toString());
    delete paramsToPersist.business_email;
  try {
      let profileId: Binary = new Binary(Buffer.from(cookies().get(anonymoussessionidCookie.name)!.value), Binary.SUBTYPE_UUID);
      await client.connect();
      const database = client.db('compensation'); // Choose a name for your database
      const collection = database.collection(UserProfile.COLLECTION_NAME); // Choose a name for your collection
      await collection.updateOne(
        { _id: profileId }, 
        { $set: { ...paramsToPersist}}
      );
    } catch (error) {
      res =  {
          status: "error",
      }
    } finally {
      await client.close();
    }
    return res;
  } 

  async function persistPersonalEmail(params: { personal_email: string, personal_email_validation_code: string}): Promise<{status: 'success' | 'error'}> {
    const client = new MongoClient(process.env.MONGODB_URI!);
    let res : {status: "success" | "error"} = {
        status: "success",
      };
    
    let paramsToPersist : any = {...params};
    paramsToPersist.personal_email_failed_validation_counter = 0;
    paramsToPersist.personal_email_validated = false;
    paramsToPersist.personal_email_validation_blocked = false;
    paramsToPersist.personal_email_validation_blocked_until = null;
    paramsToPersist.personal_email_hash =  Buffer.from(hashString(params.personal_email), 'utf8').toString('base64');
    paramsToPersist.persisted_at = Date.now();
    try {
        let profileId: Binary = new Binary(Buffer.from(cookies().get(anonymoussessionidCookie.name)!.value), Binary.SUBTYPE_UUID);
        await client.connect();
        const database = client.db('compensation'); // Choose a name for your database
        const collection = database.collection(UserProfile.COLLECTION_NAME); // Choose a name for your collection
        await collection.updateOne(
          { _id: profileId }, 
          { $set: { ...paramsToPersist}}
        );
      } catch (error) {
        res =  {
            status: "error",
        }
      } finally {
        await client.close();
      }
      return res;
    } 


  function hashString(contentStr: string): string {
      // Use the crypto module to create a hash of the CSS content
      const hash = createHash('sha256').update(contentStr).digest('base64');
      // Return the CSP compatible hash
      return `sha256-${hash}`;
    }

  function extractDomain(email: string): string {
      return email.split('@')[1];
  }

  function generateRandomCode(): string {
    let voyels = 'AEIOUY';
    let consomns = 'BCDFGHJKLMNPQRSTVWXZ';
    const firstChar = consomns[randomInt(0,20)];
    const secondChar = voyels[randomInt(0,5)];
    const thirdChar = consomns[randomInt(0,20)];
    const number = randomInt(100,999);
    return firstChar + secondChar + thirdChar + number;
  }