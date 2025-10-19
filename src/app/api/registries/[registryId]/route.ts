import { getRegistryData } from "@/app/lib/reguidb/registry";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ registryId: string }> }) {
    const { registryId } = await params;

    const regData = await getRegistryData(parseInt(registryId));

    return NextResponse.json({ 
        id: regData.id,
        url: regData.url,
        nom: regData.nom,
        is_public: regData.is_public,
     }, { status: 200 });
}