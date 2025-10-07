import { listRepositories } from '@/app/lib/registry/connector';
import { getRegistryData } from "@/app/lib/reguidb/registry";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,{params}){
    const {registryId} = params;

    const registryData = await getRegistryData(parseInt(registryId));

    const registryRepositories = await listRepositories(registryData.url);
    const repositoriesList = [];

    for (let i = 0; i < registryRepositories.repositories.length; i++) {
        repositoriesList.push({
            id:i,
            name: registryRepositories.repositories[i]
        });
    }

    return NextResponse.json({repositories: repositoriesList}, {status: 200});
}