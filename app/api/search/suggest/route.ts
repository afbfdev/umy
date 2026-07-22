import { NextResponse } from "next/server";
import { suggestProducts, suggestCategories } from "@/lib/data/catalog";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q") ?? "";
  if (q.trim().length < 2) {
    return NextResponse.json({ categories: [], products: [] });
  }
  const [categories, products] = await Promise.all([
    suggestCategories(q, 3),
    suggestProducts(q, 6),
  ]);
  return NextResponse.json(
    { categories, products },
    {
      headers: {
        // Cache CDN/navigateur : les suggestions changent peu.
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}
