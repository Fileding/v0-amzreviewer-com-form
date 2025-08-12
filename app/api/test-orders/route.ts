import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  const results = {
    tests: [],
    summary: { passed: 0, failed: 0 },
  }

  try {
    const supabase = createServerClient()

    // 测试1: 数据库连接
    try {
      const { data: tables, error } = await supabase
        .from("information_schema.tables")
        .select("table_name")
        .eq("table_name", "customer_orders")

      if (error) throw error

      results.tests.push({
        name: "数据库连接测试",
        status: "PASSED",
        message: `customer_orders表${tables?.length ? "存在" : "不存在"}`,
      })
      results.summary.passed++
    } catch (error) {
      results.tests.push({
        name: "数据库连接测试",
        status: "FAILED",
        message: error instanceof Error ? error.message : "连接失败",
      })
      results.summary.failed++
    }

    // 测试2: 插入测试数据
    const testOrder = {
      order_time: new Date().toISOString(),
      country: "美国",
      asin: "B123TEST456",
      keywords: "测试关键词",
      position_page: 1,
      unit_price: 29.99,
      has_gift_card: true,
      brand_name: "测试品牌",
      store_name: "测试店铺",
      product_keywords_cn: "测试中文关键词",
      total_orders: 100,
      daily_orders: 10,
      notes: "这是一个测试订单",
    }

    let insertedOrderId = null
    try {
      const { data, error } = await supabase.from("customer_orders").insert([testOrder]).select().single()

      if (error) throw error

      insertedOrderId = data.id
      results.tests.push({
        name: "插入订单测试",
        status: "PASSED",
        message: `成功插入订单，ID: ${insertedOrderId}`,
      })
      results.summary.passed++
    } catch (error) {
      results.tests.push({
        name: "插入订单测试",
        status: "FAILED",
        message: error instanceof Error ? error.message : "插入失败",
      })
      results.summary.failed++
    }

    // 测试3: 查询测试数据
    try {
      const { data, error, count } = await supabase
        .from("customer_orders")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })

      if (error) throw error

      results.tests.push({
        name: "查询订单测试",
        status: "PASSED",
        message: `成功查询到 ${count} 条订单记录`,
      })
      results.summary.passed++
    } catch (error) {
      results.tests.push({
        name: "查询订单测试",
        status: "FAILED",
        message: error instanceof Error ? error.message : "查询失败",
      })
      results.summary.failed++
    }

    // 测试4: 更新测试数据
    if (insertedOrderId) {
      try {
        const { data, error } = await supabase
          .from("customer_orders")
          .update({ notes: "已更新的测试订单" })
          .eq("id", insertedOrderId)
          .select()

        if (error) throw error

        results.tests.push({
          name: "更新订单测试",
          status: "PASSED",
          message: `成功更新订单 ${insertedOrderId}`,
        })
        results.summary.passed++
      } catch (error) {
        results.tests.push({
          name: "更新订单测试",
          status: "FAILED",
          message: error instanceof Error ? error.message : "更新失败",
        })
        results.summary.failed++
      }
    }

    // 测试5: 删除测试数据
    if (insertedOrderId) {
      try {
        const { error } = await supabase.from("customer_orders").delete().eq("id", insertedOrderId)

        if (error) throw error

        results.tests.push({
          name: "删除订单测试",
          status: "PASSED",
          message: `成功删除测试订单 ${insertedOrderId}`,
        })
        results.summary.passed++
      } catch (error) {
        results.tests.push({
          name: "删除订单测试",
          status: "FAILED",
          message: error instanceof Error ? error.message : "删除失败",
        })
        results.summary.failed++
      }
    }

    // 测试6: 最终数据统计
    try {
      const { count, error } = await supabase.from("customer_orders").select("*", { count: "exact", head: true })

      if (error) throw error

      results.tests.push({
        name: "最终数据统计",
        status: "PASSED",
        message: `数据库中现有 ${count} 条订单记录`,
      })
      results.summary.passed++
    } catch (error) {
      results.tests.push({
        name: "最终数据统计",
        status: "FAILED",
        message: error instanceof Error ? error.message : "统计失败",
      })
      results.summary.failed++
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
