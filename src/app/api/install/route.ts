import { configureDatabase } from "@/app/lib/reguidb/db";
import { createAdmin } from "@/app/lib/reguidb/user";

export async function GET() {
  try {
    // Configure the database
    await configureDatabase();
    //await createAdmin('username', 'password', 'firstName', 'lastName');
    return new Response('Database configured successfully', { status: 200 });
  } catch (error) {
    console.error('Error configuring database:', error);
    return new Response('Failed to configure database', { status: 500 });
  }
}