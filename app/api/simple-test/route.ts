import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const results = []

  try {
    const supabase = createServerClient()

    // 测试1: 直接查询订单表
    try {
      const { data, error, count } = await supabase.from("customer_orders").select("*", { count: "exact" }).limit(5)

      if (error) throw error

      results.push({
        test: "查询现有订单",
        status: "SUCCESS",
        message: `找到 ${count} 条订单记录`,
        data: data,
      })
    } catch (error) {
      results.push({
        test: "查询现有订单",
        status: "ERROR",
        message: error instanceof Error ? error.message : "查询失败",
      })
    }

    // 测试2: 插入一条测试订单
    try {
      const testOrder = {
        order_time: new Date().toISOString(),
        country: "中国",
        asin: "B123456789",
        keywords: "测试产品",
        position_page: 1,
        unit_price: 99.99,
        has_gift_card: false,
        brand_name: "测试品牌",
        store_name: "测试店铺",
        product_keywords_cn: "测试中文关键词",
        total_orders: 50,
        daily_orders: 5,
        notes: "API测试订单",
      }

      const { data, error } = await supabase.from("customer_orders").insert([testOrder]).select().single()

      if (error) throw error

      results.push({
        test: "插入测试订单",
        status: "SUCCESS",
        message: `成功插入订单，ID: ${data.id}`,
        data: data,
      })
    } catch (error) {
      results.push({
        test: "插入测试订单",
        status: "ERROR",
        message: error instanceof Error ? error.message : "插入失败",
      })
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "测试失败",
        results,
      },
      { status: 500 },
    )
  }
}
