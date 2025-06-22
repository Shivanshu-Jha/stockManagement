import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("stock");
    const inventory = db.collection("inventory"); // don't await this

    const Products = await inventory.find({}).toArray();

    return NextResponse.json({ success: true, Products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}


export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("stock");
    const inventory = db.collection("inventory");

    const product = await request.json();
    const result = await inventory.insertOne(product);

    return NextResponse.json({
      success: true,
      message: "Product added successfully!",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { slug } = await request.json();

    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Invalid or missing slug" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("stock");
    const inventory = db.collection("inventory");

    const result = await inventory.deleteOne({ slug });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "No product found with that slug" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Product with slug "${slug}" deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

