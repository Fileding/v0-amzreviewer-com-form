import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })

    const results = []

    // 测试1: 检查环境变量
    results.push({
      test: "环境变量检查",
      success: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
      details: {
        url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
    })

    // 测试2: 查询现有订单
    const { data: existingOrders, error: queryError } = await supabase.from("customer_orders").select("*").limit(5)

    results.push({
      test: "查询现有订单",
      success: !queryError,
      error: queryError?.message,
      data: existingOrders,
      count: existingOrders?.length || 0,
    })

    // 测试3: 插入测试订单
    const testOrder = {
      order_time: new Date().toISOString(),
      country: "美国",
      asin: "B08TEST123",
      keywords: "测试关键词",
      position: 1,
      unit_price: 29.99,
      has_gift_card: true,
      notes: "测试订单 - 5星好评带图",
      brand_name: "测试品牌",
      store_name: "测试店铺",
      product_keywords_cn: "测试产品关键词",
      total_orders: 100,
      daily_orders: 10,
    }

    const { data: insertedOrder, error: insertError } = await supabase
      .from("customer_orders")
      .insert(testOrder)
      .select()
      .single()

    results.push({
      test: "插入测试订单",
      success: !insertError,
      error: insertError?.message,
      data: insertedOrder,
    })

    // 测试4: 更新订单
    if (insertedOrder) {
      const { data: updatedOrder, error: updateError } = await supabase
        .from("customer_orders")
        .update({ notes: "已更新的测试订单" })
        .eq("id", insertedOrder.id)
        .select()
        .single()

      results.push({
        test: "更新订单",
        success: !updateError,
        error: updateError?.message,
        data: updatedOrder,
      })

      // 测试5: 删除测试订单
      const { error: deleteError } = await supabase.from("customer_orders").delete().eq("id", insertedOrder.id)

      results.push({
        test: "删除测试订单",
        success: !deleteError,
        error: deleteError?.message,
      })
    }

    // 测试6: 最终统计
    const { count, error: countError } = await supabase
      .from("customer_orders")
      .select("*", { count: "exact", head: true })

    results.push({
      test: "订单总数统计",
      success: !countError,
      error: countError?.message,
      count: count,
    })

    return NextResponse.json({
      success: true,
      message: "订单CRUD测试完成",
      results: results,
      summary: {
        total_tests: results.length,
        passed: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "未知错误",
        message: "测试执行失败",
      },
      { status: 500 },
    )
  }
}
