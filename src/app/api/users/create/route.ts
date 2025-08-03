import { NextRequest,NextResponse } from "next/server";
import { sessionIsOk } from "@/app/lib/session";
import { createUser, createAdmin } from "@/app/lib/reguidb/user";
import { checkIsAdmin } from "@/app/lib/reguidb/user";

export async function POST(req: NextRequest){
    const userId = await sessionIsOk();
    var user= null;
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const isAdmin = await checkIsAdmin(userId);
    if (!isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    var userData = await req.json();
    
    if (!userData.email || !userData.lastName || !userData.firstName || !userData.password || !userData.confirmedPassword) {
        return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
    }
    if (userData.password !== userData.confirmedPassword) {
        return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }
    if(userData.isAdmin){
        user = await createAdmin(userData.email, userData.password, userData.lastName, userData.firstName);
    } else {
        user = await createUser(userData.email, userData.password, userData.lastName, userData.firstName);
    }
    if (!user) {
        return NextResponse.json({ error: 'User creation failed' }, { status: 500 });
    }
    return NextResponse.json({ message: 'User created successfully' }, { status: 200 });
    
}