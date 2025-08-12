import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      orderTime,
      country,
      asin,
      keywords,
      positionPage,
      unitPrice,
      hasGiftCardImage,
      brandName,
      storeName,
      productKeywordsChinese,
      totalOrders,
      dailyOrders,
      notes,
    } = body

    // 验证必填字段
    if (!orderTime || !country || !asin || !keywords || !positionPage || !unitPrice || !totalOrders || !dailyOrders) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 })
    }

    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("customer_orders")
      .insert([
        {
          order_time: new Date(orderTime).toISOString(),
          country,
          asin,
          keywords,
          position_page: Number.parseInt(positionPage),
          unit_price: Number.parseFloat(unitPrice),
          has_gift_card: hasGiftCardImage,
          brand_name: brandName || null,
          store_name: storeName || null,
          product_keywords_cn: productKeywordsChinese || null,
          total_orders: Number.parseInt(totalOrders),
          daily_orders: Number.parseInt(dailyOrders),
          notes: notes || null,
        },
      ])
      .select()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "数据库错误" }, { status: 500 })
    }

    return NextResponse.json({ message: "订单信息提交成功", data }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: "缺少订单ID" }, { status: 400 })
    }

    const supabase = createServerClient()

    const { data, error } = await supabase.from("customer_orders").update(updateData).eq("id", id).select()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "数据库错误" }, { status: 500 })
    }

    return NextResponse.json({ message: "订单更新成功", data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "缺少订单ID" }, { status: 400 })
    }

    const supabase = createServerClient()

    const { error } = await supabase.from("customer_orders").delete().eq("id", id)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "数据库错误" }, { status: 500 })
    }

    return NextResponse.json({ message: "订单删除成功" })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}
