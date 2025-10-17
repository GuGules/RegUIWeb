import { ImageDetails } from '../models/registry';
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

export async function getImageData(
    registryId: string, imageName: string
) : Promise<ImageDetails> {
    const conn = await pool.getConnection();
    try{
        const [rows] = await conn.query(`SELECT * FROM images WHERE registry_id = ? AND nom_image = ?`, [registryId, imageName]);
        const data = (rows as ImageDetails[])[0];
        return data;
    } catch (err){
        console.error(err);
        throw new Error('Failed to get image data from database');
    } finally {
        pool.releaseConnection(conn);
    }
}

export async function setImageData(
    registryId: string, imageName: string, description: string
){
    const conn = await pool.getConnection();
    try{
        const [rows] = await conn.query(`INSERT INTO images (registry_id, nom_image, description) VALUES (?, ?, ?)`, [registryId, imageName, description]);
        return rows;
    } catch (err){
        console.error(err);
        throw new Error('Failed to get image data from database');
    } finally {
        pool.releaseConnection(conn);
    }
}

export async function updateImageData(
    registryId: string, imageName: string, description: string
){
    const conn = await pool.getConnection();
    try{
        const [rows] = await conn.query(`UPDATE images SET description = ? WHERE registry_id = ? AND nom_image = ?`, [description, registryId, imageName]);
        return rows;
    } catch (err){
        console.error(err);
        throw new Error('Failed to get image data from database');
    } finally {
        pool.releaseConnection(conn);
    }
}