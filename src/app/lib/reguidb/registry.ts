import { th } from 'zod/locales';
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
    description: string
){
    const conn = await pool.getConnection();

    try {
        const [result] = await conn.query(`INSERT INTO registries (nom, url${description == ""? ", description" : ""}) VALUES (?, ?${description == ""? ", ?" : ""})`, [name, url, description]);
    } catch (err){
        console.error(err);
        throw new Error('Failed to create registry into database');
    }
}