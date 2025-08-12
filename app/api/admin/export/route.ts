import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { generateCSV, generateExcel, generateFileName } from "@/lib/export-utils"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "csv" // csv 或 excel
    const search = searchParams.get("search") || ""
    const country = searchParams.get("country") || ""
    const dateFrom = searchParams.get("dateFrom") || ""
    const dateTo = searchParams.get("dateTo") || ""

    const supabase = createServerClient()

    // 构建查询 - 导出所有匹配的数据，不分页
    let query = supabase.from("customer_orders").select("*")

    // 应用筛选条件
    if (search) {
      query = query.or(`asin.ilike.%${search}%,keywords.ilike.%${search}%,brand_name.ilike.%${search}%`)
    }

    if (country && country !== "全部国家") {
      query = query.eq("country", country)
    }

    if (dateFrom) {
      query = query.gte("created_at", new Date(dateFrom).toISOString())
    }

    if (dateTo) {
      query = query.lte("created_at", new Date(dateTo + "T23:59:59").toISOString())
    }

    // 按创建时间降序排列
    query = query.order("created_at", { ascending: false })

    const { data: orders, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "数据库查询错误" }, { status: 500 })
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json({ error: "没有找到匹配的数据" }, { status: 404 })
    }

    // 生成文件内容
    let fileContent: string
    let mimeType: string
    let fileName: string

    const filters = { search, country, dateFrom, dateTo }

    if (format === "excel") {
      fileContent = generateExcel(orders)
      mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      fileName = generateFileName("excel", filters)
    } else {
      fileContent = generateCSV(orders)
      mimeType = "text/csv"
      fileName = generateFileName("csv", filters)
    }

    // 创建响应
    const response = new NextResponse(fileContent, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })

    return response
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "导出失败" }, { status: 500 })
  }
}
