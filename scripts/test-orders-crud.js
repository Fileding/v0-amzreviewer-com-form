import dotenv from "dotenv"
import { createClient } from "@supabase/supabase-js"

// 加载环境变量
dotenv.config()

// 使用环境变量创建Supabase客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log("🔍 检查环境变量...")
console.log("SUPABASE_URL:", supabaseUrl ? "✅ 存在" : "❌ 缺失")
console.log("SUPABASE_SERVICE_KEY:", supabaseServiceKey ? "✅ 存在" : "❌ 缺失")

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ 缺少Supabase环境变量")
  console.error("请确保在项目设置中配置了以下环境变量:")
  console.error("- NEXT_PUBLIC_SUPABASE_URL")
  console.error("- SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testOrdersCRUD() {
  console.log("🚀 开始测试订单CRUD操作...\n")

  try {
    // 1. 测试数据库连接
    console.log("1️⃣ 测试数据库连接...")
    const { data: tables, error: tablesError } = await supabase
      .from("customer_orders")
      .select("count", { count: "exact", head: true })

    if (tablesError) {
      console.error("❌ 数据库连接失败:", tablesError.message)
      return
    }
    console.log("✅ 数据库连接成功")

    // 2. 测试查询现有数据
    console.log("\n2️⃣ 查询现有订单数据...")
    const { data: existingOrders, error: queryError } = await supabase.from("customer_orders").select("*").limit(5)

    if (queryError) {
      console.error("❌ 查询失败:", queryError.message)
      return
    }
    console.log(`✅ 查询成功，找到 ${existingOrders.length} 条现有订单`)
    if (existingOrders.length > 0) {
      console.log("现有订单示例:", existingOrders[0])
    }

    // 3. 测试插入新订单
    console.log("\n3️⃣ 插入测试订单...")
    const testOrder = {
      order_time: new Date().toISOString(),
      country: "美国",
      asin: "B08TEST123",
      keywords: "测试关键词",
      position_page: 1,
      unit_price: 29.99,
      has_gift_card: true,
      notes: "测试订单 - 星级5星，带图",
      brand_name: "测试品牌",
      store_name: "测试店铺",
      product_keywords_cn: "测试产品关键词",
      total_orders: 100,
      daily_orders: 10,
      status: "pending",
    }

    const { data: insertedOrder, error: insertError } = await supabase
      .from("customer_orders")
      .insert(testOrder)
      .select()
      .single()

    if (insertError) {
      console.error("❌ 插入失败:", insertError.message)
      return
    }
    console.log("✅ 插入成功，订单ID:", insertedOrder.id)

    // 4. 测试查询刚插入的订单
    console.log("\n4️⃣ 查询刚插入的订单...")
    const { data: newOrder, error: selectError } = await supabase
      .from("customer_orders")
      .select("*")
      .eq("id", insertedOrder.id)
      .single()

    if (selectError) {
      console.error("❌ 查询失败:", selectError.message)
      return
    }
    console.log("✅ 查询成功:", newOrder.asin, newOrder.brand_name)

    // 5. 测试更新订单
    console.log("\n5️⃣ 更新订单状态...")
    const { data: updatedOrder, error: updateError } = await supabase
      .from("customer_orders")
      .update({
        status: "completed",
        notes: "测试订单 - 已完成",
      })
      .eq("id", insertedOrder.id)
      .select()
      .single()

    if (updateError) {
      console.error("❌ 更新失败:", updateError.message)
      return
    }
    console.log("✅ 更新成功，新状态:", updatedOrder.status)

    // 6. 测试删除订单
    console.log("\n6️⃣ 删除测试订单...")
    const { error: deleteError } = await supabase.from("customer_orders").delete().eq("id", insertedOrder.id)

    if (deleteError) {
      console.error("❌ 删除失败:", deleteError.message)
      return
    }
    console.log("✅ 删除成功")

    // 7. 验证删除
    console.log("\n7️⃣ 验证订单已删除...")
    const { data: deletedOrder, error: verifyError } = await supabase
      .from("customer_orders")
      .select("*")
      .eq("id", insertedOrder.id)
      .single()

    if (verifyError && verifyError.code === "PGRST116") {
      console.log("✅ 验证成功，订单已删除")
    } else {
      console.error("❌ 验证失败，订单仍存在")
    }

    // 8. 最终统计
    console.log("\n8️⃣ 最终订单统计...")
    const { count, error: countError } = await supabase
      .from("customer_orders")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.error("❌ 统计失败:", countError.message)
      return
    }
    console.log(`✅ 当前数据库中共有 ${count} 条订单`)

    console.log("\n🎉 所有CRUD测试完成！")
  } catch (error) {
    console.error("❌ 测试过程中发生错误:", error)
  }
}

// 运行测试
testOrdersCRUD()
