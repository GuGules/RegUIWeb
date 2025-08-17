import { configureDatabase } from "@/app/lib/reguidb/db";

export async function GET() {
  try {
    // Configure the database
    await configureDatabase();
    return new Response('Database updated successfully', { status: 200 });
  } catch (error) {
    console.error('Error updating database:', error);
    return new Response('Failed to update database', { status: 500 });
  }
}