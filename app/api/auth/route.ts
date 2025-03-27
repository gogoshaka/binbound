import { getInitAuthenticationParams } from "@/lib/types";
import { MongoClient } from "mongodb";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface Context {
  params: undefined;
}

export async function POST(request: NextRequest, context: Context) {
    let emailhash = request.nextUrl.searchParams.get("emailhash");
    if (!emailhash|| emailhash.length > 1000) {
        return NextResponse.json(
            { error: "failed to validate" },
            {
              status: 400,
            }
          );
    }
}