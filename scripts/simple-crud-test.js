const { createClient } = require("@supabase/supabase-js")

async function testOrdersCRUD() {
  console.log("🚀 开始订单CRUD测试...\n")

  // 检查环境变量
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ 缺少Supabase环境变量")
    console.log("需要的环境变量:")
    console.log("- NEXT_PUBLIC_SUPABASE_URL 或 SUPABASE_URL")
    console.log("- SUPABASE_SERVICE_ROLE_KEY 或 NEXT_PUBLIC_SUPABASE_ANON_KEY")
    return
  }

  console.log("✅ 环境变量检查通过")
  console.log(`Supabase URL: ${supabaseUrl}`)
  console.log(`Supabase Key: ${supabaseKey.substring(0, 20)}...`)

  // 创建Supabase客户端
  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // 测试1: 查询现有数据
    console.log("\n📋 测试1: 查询现有订单数据...")
    const { data: existingOrders, error: queryError } = await supabase.from("customer_orders").select("*")

    if (queryError) {
      console.error("❌ 查询失败:", queryError.message)
      return
    }

    console.log(`✅ 查询成功，找到 ${existingOrders.length} 条订单`)
    if (existingOrders.length > 0) {
      console.log("最新订单:", existingOrders[0])
    }

    // 测试2: 插入新订单
    console.log("\n➕ 测试2: 插入新订单...")
    const testOrder = {
      order_time: new Date().toISOString(),
      country: "美国",
      asin: "B08TEST123",
      keywords: "测试关键词",
      position: 5,
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
      .insert([testOrder])
      .select()

    if (insertError) {
      console.error("❌ 插入失败:", insertError.message)
      return
    }

    console.log("✅ 插入成功:", insertedOrder[0])
    const orderId = insertedOrder[0].id

    // 测试3: 更新订单
    console.log("\n✏️ 测试3: 更新订单...")
    const { data: updatedOrder, error: updateError } = await supabase
      .from("customer_orders")
      .update({ notes: "已更新的测试订单" })
      .eq("id", orderId)
      .select()

    if (updateError) {
      console.error("❌ 更新失败:", updateError.message)
    } else {
      console.log("✅ 更新成功:", updatedOrder[0])
    }

    // 测试4: 删除测试订单
    console.log("\n🗑️ 测试4: 删除测试订单...")
    const { error: deleteError } = await supabase.from("customer_orders").delete().eq("id", orderId)

    if (deleteError) {
      console.error("❌ 删除失败:", deleteError.message)
    } else {
      console.log("✅ 删除成功")
    }

    // 测试5: 最终统计
    console.log("\n📊 测试5: 最终数据统计...")
    const { count, error: countError } = await supabase
      .from("customer_orders")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.error("❌ 统计失败:", countError.message)
    } else {
      console.log(`✅ 当前订单总数: ${count}`)
    }

    console.log("\n🎉 所有测试完成！")
  } catch (error) {
    console.error("❌ 测试过程中发生错误:", error.message)
  }
}

// 运行测试
testOrdersCRUD().catch(console.error)
