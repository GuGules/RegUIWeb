import bcrypt from 'bcryptjs';
import { pool } from '@/app/lib/reguidb/db';
import type { ResultSetHeader } from 'mysql2';

type CompleteUser = {
    id: string,
    prenom: string,
    nom: string,
    email: string,
    created_at: Date,
    isAdmin: number,
    mdp: string // Le mot de passe n'est pas toujours nécessaire, par exemple lors de la création d'un utilisateur
}

export async function getUserByEmail(email: string) { 
    const [rows] = await pool.execute(`SELECT * from users WHERE email = "${email}" LIMIT 1`);
    const userData = rows as unknown[];
    if (userData.length === 0) {
        return null;
    }
    return userData[0];
}

export async function getUserById(userId: string) {
    const [rows] = await pool.execute(`SELECT id, nom, prenom, email, created_at, isAdmin from users WHERE id = "${userId}" LIMIT 1`);
    const userData = rows as unknown[];
    if (userData.length === 0) {
        return null;
    }
    return userData[0];
}

export async function checkUserPassword(email: string, password: string) {
    // Récupération de l'utilisateur par email
    const user = await getUserByEmail(email);
    if (!user) {
        return null;
    }
    const isMatch = await bcrypt.compare(password, (user as CompleteUser).mdp);
    if (!isMatch){
        return null;
    }
    return (user as CompleteUser).id;
}

async function getPasswordFromId(userId: string) {
    const [rows] = await pool.execute(`SELECT mdp FROM users WHERE id = ?`, [userId]);
    return rows as unknown[];
}

export async function checkUserPasswordWithId(userId: string, password: string) {
    // Récupération de l'utilisateur par id
    const rows = await getPasswordFromId(userId);
    const user = rows[0];
    if (!user) {
        return null;
    }
    const isMatch = await bcrypt.compare(password, (user as CompleteUser).mdp);
    if (!isMatch){
        return false;
    }
    return true;
}

export async function createUser(email: string, mdp: string, name: string, firstName: string) {
    const hashedPassword = await bcrypt.hash(mdp, 10);
    try {
        const [result] = await pool.execute(`INSERT INTO users (email, mdp, nom, prenom) VALUES (?, ?, ?, ?)`, [email, hashedPassword, name, firstName]);
        return result;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

export async function createAdmin(email: string, mdp: string, name: string, firstName: string) {
    const hashedPassword = await bcrypt.hash(mdp, 10);
    try {
        await pool.execute(`INSERT INTO users (nom, prenom, email, mdp, isAdmin) VALUES (?, ?, ?, ?, true)`, [name, firstName, email, hashedPassword]);
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}


export async function checkIsAdmin(userId: string) {
    const [rows] = await pool.execute(`SELECT * FROM users WHERE id = ?`, [userId]);
    const user = rows as CompleteUser[];
    if (!user || user.length === 0) {
        return false;
    }
    return user[0].isAdmin === 1;
}

export async function listUsers() {
    try {
        const [users] = await pool.execute(`SELECT id, nom, prenom, email, created_at, isAdmin FROM users`);
        return users;
    } catch (error) {
        console.error('Error listing users:', error);
        throw error;
    }
}

export async function deleteUserById(userId: number) {
    try {
        // Supprimer les sessions associées à l'utilisateur
        await pool.execute('DELETE FROM users WHERE id = ?', [userId]);
        return;
    } catch (error) {
        throw new Error('Error deleting user: ' + (error as Error).message);
    }
}

export async function updateUser(userId: string, firstName: string, lastName: string, isAdmin: boolean) {
    try {
        const [result] = await pool.execute(
            `UPDATE users SET prenom = ?, nom = ?, isAdmin = ? WHERE id = ?`,
            [firstName, lastName, isAdmin ? 1 : 0, userId]
        );
        const header = result as ResultSetHeader;
        if (header.affectedRows === 0) {
            throw new Error('User not found or no changes made');
        }
        return true;
    } catch (error) {
        throw new Error('Error updating user: ' + (error as Error).message);
    }
}

export async function changeUserPassword(userId: string, password: string) {
    try {
        const [result] = await pool.execute(
            'UPDATE users SET mdp = ? WHERE id = ?',
            [await bcrypt.hash(password, 10), userId]
        );
        const header = result as ResultSetHeader;
        if (header.affectedRows === 0) {
            throw new Error('User not found or no changes made');
        }
        return true;
    } catch (error) {
        throw new Error('Error changing user password: ' + (error as Error).message);
    }
}