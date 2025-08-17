import { getDbVersion } from "@/app/lib/reguidb/db";

export async function GET() {
  try {
    // Configure the database
    const version = await getDbVersion();
    return new Response(JSON.stringify({ version }), {
      status: 200
    });
  } catch (error) {
    console.error('Error configuring database:', error);
    return new Response('Failed to configure database', { status: 500 });
  }
}