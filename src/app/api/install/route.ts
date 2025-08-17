import { configureDatabase, getDbVersion } from "@/app/lib/reguidb/db";
import { createAdmin } from "@/app/lib/reguidb/user";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const version = await getDbVersion();
    if (version) {
      // Database is already configured, return a message
      return new Response('Database is already configured, forbidden action', { status: 403 });
    }
    // Configure the database
    await configureDatabase();
    const formData = await req.json();
    if (!formData.email || !formData.password || !formData.cPassword || !formData.firstName || !formData.lastName) {
      return new Response('Missing required fields', { status: 400 });
      }
      if (formData.password !== formData.cPassword) {
        return new Response('Passwords do not match', { status: 400 });
      }
      await createAdmin(formData.email, formData.password, formData.firstName, formData.lastName);
      return new Response('Database configured successfully', { status: 200 });
  } catch (error) {
    console.error('Error configuring database:', error);
    return new Response('Failed to configure database', { status: 500 });
  }
}