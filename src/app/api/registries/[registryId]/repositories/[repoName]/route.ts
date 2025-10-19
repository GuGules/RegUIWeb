import { ImageDetails } from "@/app/lib/models/registry";
import { listTags } from "@/app/lib/registry/connector";
import { getRegistryData, updateImageData } from "@/app/lib/reguidb/registry";
import { getImageData, setImageData } from "@/app/lib/reguidb/registry";
import { NextRequest,NextResponse } from "next/server";
import { Registry } from "@/app/lib/models/registry";

export async function GET(req:NextRequest,{params}: {params :Promise<{registryId:string, repoName:string}>}) {
    const {registryId, repoName} = await params;

    try{
        const registryData : Registry = await getRegistryData(parseInt(registryId));
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

        const imageDetails:ImageDetails = await getImageData(registryId, repoName);
        if (imageDetails){
            response.description = imageDetails.description;
        }

        return NextResponse.json(response);

    } catch (error) {
        console.error("Error fetching repository data:", error);
        return NextResponse.json({ error: "Failed to fetch repository data" }, { status: 500 });
    } 
    
}

export async function PUT(req:NextRequest,{params}: { params: Promise<{registryId:string, repoName:string}>}) {
    const {registryId, repoName} = await params;

    try{
        const data = await req.json();

        if (data.creationMode){
            await setImageData(registryId, repoName, data.description);
        } else {
            await updateImageData(registryId, repoName, data.description);
        }
        return NextResponse.json({ message: "Description updated successfully"}, { status: 200 });

    } catch (error) {
        console.error("Failed to update data:", error);
        return NextResponse.json({ error: "Failed to update data" }, { status: 500 });
    } 
    
}