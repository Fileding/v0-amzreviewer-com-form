"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

interface Order {
  id: string
  asin: string
  country: string
  keywords: string
  brand_name: string
  store_name: string
  unit_price: number
  total_orders: number
  daily_orders: number
  has_gift_card: boolean
  notes: string
  created_at: string
}

export default function TestOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [testResults, setTestResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const addTestResult = (message: string) => {
    setTestResults((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testQuery = async () => {
    setLoading(true)
    addTestResult("开始测试查询订单...")

    try {
      const { data, error } = await supabase
        .from("customer_orders")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        addTestResult(`❌ 查询失败: ${error.message}`)
      } else {
        setOrders(data || [])
        addTestResult(`✅ 查询成功: 找到 ${data?.length || 0} 条订单`)
      }
    } catch (err) {
      addTestResult(`❌ 查询异常: ${err}`)
    }

    setLoading(false)
  }

  const testInsert = async () => {
    setLoading(true)
    addTestResult("开始测试插入订单...")

    const testOrder = {
      asin: "B" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      country: "美国",
      keywords: "测试关键词",
      brand_name: "测试品牌",
      store_name: "测试店铺",
      product_keywords_cn: "测试中文关键词",
      unit_price: 29.99,
      total_orders: 100,
      daily_orders: 10,
      has_gift_card: true,
      notes: "这是一个测试订单",
      order_time: new Date().toISOString(),
      position_page: 1,
      status: "active",
    }

    try {
      const { data, error } = await supabase.from("customer_orders").insert([testOrder]).select()

      if (error) {
        addTestResult(`❌ 插入失败: ${error.message}`)
      } else {
        addTestResult(`✅ 插入成功: 创建了订单 ${data?.[0]?.asin}`)
        await testQuery() // 重新查询数据
      }
    } catch (err) {
      addTestResult(`❌ 插入异常: ${err}`)
    }

    setLoading(false)
  }

  const testUpdate = async () => {
    if (orders.length === 0) {
      addTestResult("❌ 没有订单可以更新，请先插入测试数据")
      return
    }

    setLoading(true)
    addTestResult("开始测试更新订单...")

    const firstOrder = orders[0]
    const newPrice = Math.round(Math.random() * 100 * 100) / 100

    try {
      const { error } = await supabase
        .from("customer_orders")
        .update({
          unit_price: newPrice,
          notes: `更新于 ${new Date().toLocaleString()}`,
        })
        .eq("id", firstOrder.id)

      if (error) {
        addTestResult(`❌ 更新失败: ${error.message}`)
      } else {
        addTestResult(`✅ 更新成功: 订单 ${firstOrder.asin} 价格更新为 $${newPrice}`)
        await testQuery() // 重新查询数据
      }
    } catch (err) {
      addTestResult(`❌ 更新异常: ${err}`)
    }

    setLoading(false)
  }

  const testDelete = async () => {
    if (orders.length === 0) {
      addTestResult("❌ 没有订单可以删除，请先插入测试数据")
      return
    }

    setLoading(true)
    addTestResult("开始测试删除订单...")

    const lastOrder = orders[orders.length - 1]

    try {
      const { error } = await supabase.from("customer_orders").delete().eq("id", lastOrder.id)

      if (error) {
        addTestResult(`❌ 删除失败: ${error.message}`)
      } else {
        addTestResult(`✅ 删除成功: 删除了订单 ${lastOrder.asin}`)
        await testQuery() // 重新查询数据
      }
    } catch (err) {
      addTestResult(`❌ 删除异常: ${err}`)
    }

    setLoading(false)
  }

  const runAllTests = async () => {
    setTestResults([])
    addTestResult("🚀 开始运行完整的CRUD测试...")

    await testQuery()
    await new Promise((resolve) => setTimeout(resolve, 1000))

    await testInsert()
    await new Promise((resolve) => setTimeout(resolve, 1000))

    await testUpdate()
    await new Promise((resolve) => setTimeout(resolve, 1000))

    await testDelete()

    addTestResult("🎉 所有测试完成!")
  }

  useEffect(() => {
    testQuery()
  }, [])

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">订单CRUD功能测试</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 测试控制面板 */}
        <Card>
          <CardHeader>
            <CardTitle>测试控制面板</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={testQuery} disabled={loading} variant="outline">
                查询订单
              </Button>
              <Button onClick={testInsert} disabled={loading} variant="outline">
                插入订单
              </Button>
              <Button onClick={testUpdate} disabled={loading} variant="outline">
                更新订单
              </Button>
              <Button onClick={testDelete} disabled={loading} variant="outline">
                删除订单
              </Button>
            </div>
            <Button onClick={runAllTests} disabled={loading} className="w-full">
              {loading ? "测试中..." : "运行完整测试"}
            </Button>
          </CardContent>
        </Card>

        {/* 测试结果 */}
        <Card>
          <CardHeader>
            <CardTitle>测试结果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg h-64 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-gray-500">等待测试结果...</p>
              ) : (
                testResults.map((result, index) => (
                  <div key={index} className="text-sm mb-1 font-mono">
                    {result}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 订单列表 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>当前订单数据 ({orders.length} 条)</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-gray-500">暂无订单数据</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">ASIN</th>
                    <th className="text-left p-2">国家</th>
                    <th className="text-left p-2">品牌</th>
                    <th className="text-left p-2">价格</th>
                    <th className="text-left p-2">总单数</th>
                    <th className="text-left p-2">创建时间</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="p-2">{order.asin}</td>
                      <td className="p-2">{order.country}</td>
                      <td className="p-2">{order.brand_name}</td>
                      <td className="p-2">${order.unit_price}</td>
                      <td className="p-2">{order.total_orders}</td>
                      <td className="p-2">{new Date(order.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
