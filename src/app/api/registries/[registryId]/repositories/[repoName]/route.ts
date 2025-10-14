import { listTags } from "@/app/lib/registry/connector";
import { getRegistryData } from "@/app/lib/reguidb/registry";
import { getImageData } from "@/app/lib/reguidb/registry";
import { NextRequest,NextResponse } from "next/server";

export async function GET(req:NextRequest,{params}){
    const {registryId, repoName} = params;

    try{
        const registryData:any = await getRegistryData(parseInt(registryId));
        const repoTags = await listTags(registryData.url, repoName);
        let namePrefix = "";
        if (registryData.url.startsWith("https://")){
            namePrefix = registryData.url.replace("https://", "");
        }
        else if (registryData.url.startsWith("http://")){
            namePrefix = registryData.url.replace("http://", "");
        }

        const response = {
            name: namePrefix+(registryData.url.endsWith("/") ? "" : "/")+repoName,
            tags: repoTags.tags,
            description: ""
        }

        const imageDetails:any = await getImageData(registryId, repoName);
        if (imageDetails){
            response.description = imageDetails.description;
        }

        return NextResponse.json(response);

    } catch (error) {
        console.error("Error fetching repository data:", error);
        return NextResponse.json({ error: "Failed to fetch repository data" }, { status: 500 });
    } 
    
}