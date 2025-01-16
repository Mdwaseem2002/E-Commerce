import { connectToDatabase } from "../../../utils/mongodb";


export async function POST(req) {
  try {
    const { db } = await connectToDatabase(); // Get the database instance
    const body = await req.json();

    // Example: Insert user into the `users` collection
    const result = await db.collection("users").insertOne(body);

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in POST /api/users:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
