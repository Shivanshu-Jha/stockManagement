import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {

    let { action, slug, initialQuantity } = await request.json();

    try {
        const client = await clientPromise;
        const db = client.db("stock");
        const inventory = db.collection("inventory");

        const filter = { slug: slug };

        let newQuantity = action == "subtract" ? (parseInt(initialQuantity) - 1) : (parseInt(initialQuantity) + 1);
        // Specify the update to set a value for the plot field
        const updateDoc = {
            $set: {
                quantity: newQuantity
            },
        };
        // Update the first document that matches the filter
        const result = await inventory.updateOne(filter, updateDoc, {});

        // Print the number of matching and modified documents

        return NextResponse.json({ success: true, message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)` });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Database connection error" }, { status: 500 });
    }
}
