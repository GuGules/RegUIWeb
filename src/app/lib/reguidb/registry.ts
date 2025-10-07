import { pool } from './db';

export async function listRegistries(){
    const conn = await pool.getConnection();

    try {
        const [rows] = await conn.query("select * from registries");
        return rows;
    }
    catch (err){
        console.error(err);
    }

    pool.releaseConnection(conn);
}

export async function createRegistry(
    name: string,
    url: string,
    isPublic: boolean = false,
    description: string
){
    const conn = await pool.getConnection();

    try {
        const [result] = await conn.query(`INSERT INTO registries (nom, url${description == ""? ", description" : ""}, is_public) VALUES (?, ?${description == ""? ", ?" : ""}, ?)`, [name, url, description, isPublic]);
    } catch (err){
        console.error(err);
        throw new Error('Failed to create registry into database');
    }
}

export async function deleteRegistry(
    registryId: number
){
    const conn = await pool.getConnection();

    try {
        await conn.query(`DELETE FROM registries WHERE id = ?`, [registryId]);
    } catch (err){
        console.log(err);
        throw new Error('Failed to delete registry from database');
    } finally {
        pool.releaseConnection(conn);
    }
}

export async function getRegistryData(
    registryId: number
){
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(`SELECT * FROM registries WHERE id = ?`, [registryId]);
        if (Array.isArray(rows) && rows.length > 0){
            // @ts-ignore
            return rows[0];
        }
        throw new Error('No registry found with this ID');
    } catch (err){
        console.error(err);
        throw new Error('Failed to get registry URL from database');
    } finally {
        pool.releaseConnection(conn);
    }
}
