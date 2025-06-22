import clientPromise from "@/lib/mongodb";

export async function GET(request) {
    try {
        const client = await clientPromise;
        const db = client.db("shmongo");
        const result = await db.collection("data").find({}).toArray();

        return Response.json({ result });
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Database connection error" }, { status: 500 });
    }
}
    