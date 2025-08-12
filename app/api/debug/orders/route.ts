import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/response"

export async function GET() {
  try {
    const supabase = createServerClient()

    const {
      data: orders,
      error,
      count,
    } = await supabase.from("customer_orders").select("*", { count: "exact" }).order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        {
          error: "Database error",
          details: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      total_count: count,
      orders: orders || [],
      message: `Found ${count || 0} orders in database`,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
