export class Registry {
    id: number = 0;
    nom: string = "";
    url: string = "";
    description: string = "";
    is_public: number = 0;
}

export class ImageDetails {
    id:number = 0;
    registry_id: number = 0;
    repo_name: string = "";
    description: string = "";
}