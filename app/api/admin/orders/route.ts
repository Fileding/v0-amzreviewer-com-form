import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""
    const country = searchParams.get("country") || ""
    const dateFrom = searchParams.get("dateFrom") || ""
    const dateTo = searchParams.get("dateTo") || ""

    const supabase = createServerClient()

    // 构建查询
    let query = supabase.from("customer_orders").select("*", { count: "exact" })

    // 搜索条件
    if (search) {
      query = query.or(`asin.ilike.%${search}%,keywords.ilike.%${search}%,brand_name.ilike.%${search}%`)
    }

    if (country && country !== "全部国家") {
      query = query.eq("country", country)
    }

    // 日期范围筛选
    if (dateFrom) {
      query = query.gte("created_at", new Date(dateFrom).toISOString())
    }
    if (dateTo) {
      query = query.lte("created_at", new Date(dateTo + "T23:59:59").toISOString())
    }

    // 分页和排序
    const offset = (page - 1) * limit
    query = query.order("created_at", { ascending: false }).range(offset, offset + limit - 1)

    const { data: orders, error, count } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "数据库查询错误" }, { status: 500 })
    }

    const totalPages = Math.ceil((count || 0) / limit)

    return NextResponse.json({
      orders: orders || [],
      totalCount: count || 0,
      totalPages,
      currentPage: page,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}
