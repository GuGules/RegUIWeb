export async function listRepositories(reg){
    if (reg.endsWith('/')) {
        reg = reg.slice(0, -1);
    }
    return fetch(`${reg}/v2/_catalog`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    }).then(res => res.json());
}