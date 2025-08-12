interface OrderExportData {
  id: string
  created_at: string
  order_time: string
  country: string
  asin: string
  keywords: string
  position_page: number
  unit_price: number
  has_gift_card_image: boolean
  brand_name: string | null
  store_name: string | null
  product_keywords_chinese: string | null
  total_orders: number
  daily_orders: number
  notes: string | null
}

// CSV导出功能
export function generateCSV(orders: OrderExportData[]): string {
  const headers = [
    "ID",
    "提交时间",
    "下单时间",
    "国家",
    "ASIN",
    "关键词",
    "位置页码",
    "客单价",
    "主图是否放礼品卡",
    "品牌名",
    "店铺名",
    "产品关键词中文名",
    "总单数",
    "每天单数",
    "备注",
  ]

  const csvContent = [
    headers.join(","),
    ...orders.map((order) =>
      [
        order.id,
        formatDateForExport(order.created_at),
        formatDateForExport(order.order_time),
        `"${order.country}"`,
        `"${order.asin}"`,
        `"${escapeCSV(order.keywords)}"`,
        order.position_page,
        order.unit_price,
        order.has_gift_card_image ? "是" : "否",
        `"${escapeCSV(order.brand_name || "")}"`,
        `"${escapeCSV(order.store_name || "")}"`,
        `"${escapeCSV(order.product_keywords_chinese || "")}"`,
        order.total_orders,
        order.daily_orders,
        `"${escapeCSV(order.notes || "")}"`,
      ].join(","),
    ),
  ].join("\n")

  // 添加BOM以支持中文显示
  return "\uFEFF" + csvContent
}

// Excel导出功能 (使用CSV格式，但设置正确的MIME类型)
export function generateExcel(orders: OrderExportData[]): string {
  return generateCSV(orders)
}

// 转义CSV特殊字符
function escapeCSV(str: string): string {
  if (!str) return ""
  // 转义双引号并处理换行符
  return str.replace(/"/g, '""').replace(/\n/g, " ").replace(/\r/g, " ")
}

// 格式化日期用于导出
function formatDateForExport(dateString: string): string {
  return new Date(dateString).toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

// 生成文件名
export function generateFileName(format: "csv" | "excel", filters?: any): string {
  const date = new Date().toISOString().split("T")[0]
  const extension = format === "excel" ? "xlsx" : "csv"

  let filename = `orders-${date}`

  if (filters?.country && filters.country !== "全部国家") {
    filename += `-${filters.country}`
  }

  if (filters?.dateFrom || filters?.dateTo) {
    filename += "-filtered"
  }

  return `${filename}.${extension}`
}
