import mysql from 'mysql2/promise';
import fs from 'fs';
import { removeStringItemFromStringArray } from '../utils/arrayTools';

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
        let sql_files:string[] = fs.readdirSync('./sql')
        try {
            const dbVersion = await getDbVersion();
            if (dbVersion === null) {
                throw new Error('Database version not found (Unknown database)');
            }

            // On ignore les fichiers sql dont la version est déjà appliquée
            for (let i = 1; i <= dbVersion; i++){
                const sqlFileName:string = `v${i}.sql`;
                if (sql_files.includes(sqlFileName)) {
                    sql_files = removeStringItemFromStringArray(sql_files,sqlFileName);
                }
            }

            // On exécute les fichiers dont la version est plus récente à celle en base
            for (const file of sql_files) {
                const sql = (await fs.readFileSync('./sql/'+file)).toString();
                const statements = sql
                    .split(';')
                    .map(s => s.trim())
                    .filter(s => s.length > 0);

                for (const statement of statements) {
                    await pool.query(statement);
                }
            }

        } catch (error: unknown){
            if ((error as {sqlMessage : string}).sqlMessage.indexOf("Unknown database") !== -1){

                // Database not installed, here the installation

                const rootConnection = await mysql.createConnection({
                    host: process.env.DB_HOST,
                    port: parseInt(process.env.DB_PORT || '3306', 10),
                    user: process.env.DB_USER,
                    password: process.env.DB_PASSWORD
                });

                for (const file of sql_files) {
                    const sql = (await fs.readFileSync('./sql/'+file)).toString();
                    const statements = sql
                        .split(';')
                        .map(s => s.trim())
                        .filter(s => s.length > 0);

                    for (const statement of statements) {
                        await rootConnection.query(statement);
                    }
                }
                await rootConnection.end();
            } else {
                console.error("A unexpected error has occured : ", error)
            }
        }
    } catch (error){
        console.error('Error configuring database:', error);
    }
}

export async function getDbVersion(){
    try {
        const [rows] = await pool.execute('SELECT value FROM config WHERE `key` = "db_version"');
        const infos = rows as unknown[];
        return (infos[0] as {value: number}).value;
    } catch (error) {
        console.error('Error getting database version:', error);
        return null;
    }
}