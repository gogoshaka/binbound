import { getInitAuthenticationParams } from "@/lib/types";
import { MongoClient } from "mongodb";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface Context {
  params: undefined;
}

export async function GET(request: NextRequest, context: Context) {
    let emailhash = request.nextUrl.searchParams.get("emailhash");
    if (!emailhash|| emailhash.length > 1000) {
        return NextResponse.json(
            { error: "failed to validate" },
            {
              status: 400,
            }
          );
    }
    let validationcode = request.nextUrl.searchParams.get("validationcode");
    if (!validationcode || validationcode.length > 1000) {
        return NextResponse.json(
            { error: "failed to validate" },
            {
              status: 400,
            }
          );
    }
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const database = client.db('compensation'); 
    const collection = database.collection('profile');
    let result = await collection.findOne({ personal_email_hash: emailhash});
    if (result == null) {
        console.log("personal email not found in db")
        return NextResponse.json(
            { error: "failed to validate" },
            {
              status: 400,
            }
          );
    }

    if (result.personal_email_failed_validation_counter > 5) {
        return NextResponse.json(
            { error: "failed to validate" },
            {
              status: 400,
            }
          );
    }
    if (result.personal_email_validation_code != validationcode) {
        await collection.updateOne({ personal_email_hash: emailhash}, { $inc: { personal_email_failed_validation_counter: 1 } });
        return NextResponse.json(
            { error: "failed to validate" },
            {
              status: 400,
            }
          );
    }
    if (result.personal_email_validated) {
        return NextResponse.json(
            { error: "failed to validate" },
            {
              status: 400,
            }
          );
    }
    if (result.personal_email_validation_code === validationcode) {
        // set the user_id only when the validation is successful
        let userId = crypto.randomUUID();
        await collection.updateOne({ personal_email_hash: emailhash}, { $set: { user_id:  userId, personal_email_validated: true} });
        let initAuthenticationParams = getInitAuthenticationParams();
        initAuthenticationParams.user_id = userId;
        initAuthenticationParams.personal_email = result.personal_email;
        initAuthenticationParams.created_at = Date.now();
        const authenticationcollection =  database.collection('authentication');
        await authenticationcollection.insertOne(initAuthenticationParams);
        return NextResponse.json(
            {
              status: 200,
            }
          );
    }
}
