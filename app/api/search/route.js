import clientPromise from "@/lib/mongodb";

export async function GET(request) {
    try {
        const client = await clientPromise;
        const db = client.db("stock");
        const inventory = db.collection("inventory");

        const { searchParams } = new URL(request.url);
        const searchQuery = searchParams.get("q") || "";

        const query = searchQuery
            ? [
                {
                    $match: {
                        $or: [
                            { slug: { $regex: searchQuery, $options: "i" } },
                            { category: { $regex: searchQuery, $options: "i" } },
                            { quantity: { $regex: searchQuery, $options: "i" } },
                            { price: { $regex: searchQuery, $options: "i" } }
                        ]
                    }
                }
            ]
            : [];

        const Products = await inventory.aggregate(query).toArray();

        return Response.json({ success: true, Products });
    } catch (error) {
        console.error("Error in /api/search:", error);
        return Response.json({ error: "Database connection error" }, { status: 500 });
    }
}
