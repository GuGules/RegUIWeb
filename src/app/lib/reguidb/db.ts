import mysql from 'mysql2/promise';
import fs from 'fs';

export const pool = await mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10), // Ajuste selon tes besoins
    queueLimit: 0
})

export async function configureDatabase(){
    try {
        // On liste les fichiers SQL dans le dossier migrations
        const sql_files = fs.readdirSync('./sql')
        console.log(sql_files)
    } catch (error){
        console.error('Error configuring database:', error);
    }
}