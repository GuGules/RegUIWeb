import { deleteRegistry } from "@/app/lib/reguidb/registry";
import { checkIsAdmin } from "@/app/lib/reguidb/user";
import { sessionIsOk } from "@/app/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req:NextRequest,{params}){
    console.log(params)
    const {registryId} = params;

    const userId = await sessionIsOk();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = await checkIsAdmin(userId);
    if (!isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        await deleteRegistry(parseInt(registryId));
    } catch (error) {
        return NextResponse.json({error:'Internal Server Error'},{status:500});
    }

    return NextResponse.json({message:`Delete registry ${registryId}`}, {status:200});    
}