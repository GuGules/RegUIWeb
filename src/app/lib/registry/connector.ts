function uniformUrl(url: string): string {
    if (!url.startsWith('http') && !url.startsWith('https')){
        url = 'http://' + url;
    }
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    return url;
}

export async function listRepositories(reg: string){
    reg = uniformUrl(reg);
    return fetch(`${reg}/v2/_catalog`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    }).then(res => res.json());
}

export async function listTags(reg: string, repo: string){
    try {
    reg = uniformUrl(reg);
    return fetch(`${reg}/v2/${repo}/tags/list`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    }).then(res => res.json());
    } catch (error) {
        console.error("Error fetching tags:", error);
        throw new Error("Failed to fetch tags");
    }

}