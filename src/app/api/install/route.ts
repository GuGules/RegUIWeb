import { configureDatabase } from "@/app/lib/reguidb/db";

export async function GET() {
  try {
    
    console.log('BEFORE:', process.env.APP_MODE);
    process.env.APP_MODE = 'prod';
    console.log('AFTER:', process.env.APP_MODE);
    // Configure the database
    await configureDatabase();
    return new Response('Database configured successfully', { status: 200 });
  } catch (error) {
    console.error('Error configuring database:', error);
    return new Response('Failed to configure database', { status: 500 });
  }
}