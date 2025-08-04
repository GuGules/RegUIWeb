import {pool} from '@/app/lib/reguidb/db';

type Session = {
    user_id: string;
    session_token: string;
    expires_at: Date;
}

export async function saveSession(userId:string, session:string) {
    try {
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1); // Session d'une durée d'un mois
        await pool.execute('INSERT INTO sessions (user_id, session_token,expires_at) VALUES (?, ?, ?)', [userId, session, expiresAt.toString()]);
    } catch (error) {
        console.error('Error saving session:', error);
        throw error;
    }
}

export async function checkSession(userId:number, session:string){
    try {
        const [rows] = await pool.execute('SELECT * FROM sessions WHERE user_id = ? AND session_token = ? ORDER BY id DESC', [userId.toString(),session]);
        const sessions = rows as Session[]; // Ajout du cast
        if (sessions.length === 0){
            return null;
        }

        const session_expiresAt = new Date(sessions[0].expires_at);
        if (session_expiresAt < new Date()) {
            return null;
        } else {
            return sessions[0].user_id;
        }

    } catch (error) {
        console.error('Error checking session:', error);
        throw error;
    }
}

export async function deleteSavedSession(session:string){
    try {
        await pool.execute('DELETE FROM sessions WHERE session_token = ?', [session]);
    } catch (error) {
        console.error('Error deleting session:', error);
        throw error;
    }
}

export async function deleteUserSessions(userId:string){
    try {
        await pool.execute('DELETE FROM sessions WHERE user_id = ?', [userId])
        return true;
    } catch (error: unknown){
        throw new Error('Error deleting user sessions: ' + (error as Error).message);
    }
}