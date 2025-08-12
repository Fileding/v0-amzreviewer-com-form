"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import ExportDialog from "@/components/export-dialog"

interface Order {
  id: string
  created_at: string
  order_time: string
  country: string
  asin: string
  keywords: string
  position_page: number
  unit_price: number
  has_gift_card: boolean
  brand_name: string | null
  store_name: string | null
  product_keywords_cn: string | null
  total_orders: number
  daily_orders: number
  notes: string | null
}

interface FilterState {
  search: string
  country: string
  dateFrom: string
  dateTo: string
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    country: "全部国家",
    dateFrom: "",
    dateTo: "",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const countries = [
    "美国",
    "加拿大",
    "英国",
    "德国",
    "法国",
    "意大利",
    "西班牙",
    "日本",
    "澳大利亚",
    "印度",
    "墨西哥",
    "巴西",
    "荷兰",
    "瑞典",
    "其他",
  ]

  const fetchOrders = async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...filters,
      })

      const response = await fetch(`/api/admin/orders?${params}`)
      const data = await response.json()

      if (response.ok) {
        setOrders(data.orders)
        setTotalPages(data.totalPages)
        setTotalCount(data.totalCount)
        setCurrentPage(page)
      } else {
        toast({
          title: "获取数据失败",
          description: data.error || "请稍后重试",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "网络错误",
        description: "请检查网络连接",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders(1)
  }, [filters])

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      country: "全部国家",
      dateFrom: "",
      dateTo: "",
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("zh-CN")
  }

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`
  }

  return (
    <div className="space-y-6">
      {/* 筛选器 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            数据筛选
          </CardTitle>
          <CardDescription>使用下方筛选器来查找特定的订单数据</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">搜索</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜索ASIN、关键词、品牌..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">国家</label>
              <Select value={filters.country} onValueChange={(value) => handleFilterChange("country", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择国家" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="全部国家">全部国家</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">开始日期</label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">结束日期</label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button variant="outline" onClick={clearFilters}>
              清除筛选
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => fetchOrders(currentPage)}>
                <RefreshCw className="h-4 w-4 mr-2" />
                刷新
              </Button>
              <ExportDialog filters={filters} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 数据表格 */}
      <Card>
        <CardHeader>
          <CardTitle>订单数据列表</CardTitle>
          <CardDescription>共 {totalCount} 条记录</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>提交时间</TableHead>
                      <TableHead>下单时间</TableHead>
                      <TableHead>国家</TableHead>
                      <TableHead>ASIN</TableHead>
                      <TableHead>关键词</TableHead>
                      <TableHead>位置</TableHead>
                      <TableHead>单价</TableHead>
                      <TableHead>品牌</TableHead>
                      <TableHead>总单数</TableHead>
                      <TableHead>每日单数</TableHead>
                      <TableHead>礼品卡</TableHead>
                      <TableHead>备注</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="text-sm">{formatDate(order.created_at)}</TableCell>
                        <TableCell className="text-sm">{formatDate(order.order_time)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{order.country}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{order.asin}</TableCell>
                        <TableCell className="max-w-xs truncate" title={order.keywords}>
                          {order.keywords}
                        </TableCell>
                        <TableCell>{order.position_page}</TableCell>
                        <TableCell className="font-mono">{formatPrice(order.unit_price)}</TableCell>
                        <TableCell className="max-w-xs truncate" title={order.brand_name || ""}>
                          {order.brand_name || "-"}
                        </TableCell>
                        <TableCell>{order.total_orders}</TableCell>
                        <TableCell>{order.daily_orders}</TableCell>
                        <TableCell>
                          <Badge variant={order.has_gift_card ? "default" : "secondary"}>
                            {order.has_gift_card ? "是" : "否"}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate" title={order.notes || ""}>
                          {order.notes || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* 分页 */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchOrders(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    上一页
                  </Button>

                  <span className="text-sm text-gray-600">
                    第 {currentPage} 页，共 {totalPages} 页
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchOrders(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    下一页
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
