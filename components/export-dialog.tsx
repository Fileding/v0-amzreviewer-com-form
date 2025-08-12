"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, Table } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ExportDialogProps {
  filters: {
    search: string
    country: string
    dateFrom: string
    dateTo: string
  }
}

export default function ExportDialog({ filters }: ExportDialogProps) {
  const [format, setFormat] = useState<"csv" | "excel">("csv")
  const [isExporting, setIsExporting] = useState(false)
  const [open, setOpen] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const params = new URLSearchParams({
        ...filters,
        format,
      })

      const response = await fetch(`/api/admin/export?${params}`)

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url

        // 从响应头获取文件名
        const contentDisposition = response.headers.get("content-disposition")
        let filename = `orders-${new Date().toISOString().split("T")[0]}.${format === "excel" ? "xlsx" : "csv"}`

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
          if (filenameMatch) {
            filename = decodeURIComponent(filenameMatch[1].replace(/['"]/g, ""))
          }
        }

        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "导出成功",
          description: `文件 ${filename} 已开始下载`,
        })

        setOpen(false)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "导出失败")
      }
    } catch (error) {
      toast({
        title: "导出失败",
        description: error instanceof Error ? error.message : "请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          导出数据
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>导出数据</DialogTitle>
          <DialogDescription>选择导出格式并下载当前筛选条件下的所有数据</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">导出格式</label>
            <Select value={format} onValueChange={(value: "csv" | "excel") => setFormat(value)}>
              <SelectTrigger>
                <SelectValue placeholder="选择格式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    CSV 格式
                  </div>
                </SelectItem>
                <SelectItem value="excel">
                  <div className="flex items-center">
                    <Table className="h-4 w-4 mr-2" />
                    Excel 格式
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 显示当前筛选条件 */}
          <div className="bg-gray-50 p-3 rounded-lg text-sm">
            <div className="font-medium mb-2">当前筛选条件：</div>
            <div className="space-y-1 text-gray-600">
              {filters.search && <div>搜索: {filters.search}</div>}
              {filters.country && filters.country !== "全部国家" && <div>国家: {filters.country}</div>}
              {filters.dateFrom && <div>开始日期: {filters.dateFrom}</div>}
              {filters.dateTo && <div>结束日期: {filters.dateTo}</div>}
              {!filters.search &&
                (!filters.country || filters.country === "全部国家") &&
                !filters.dateFrom &&
                !filters.dateTo && <div>无筛选条件 (导出全部数据)</div>}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isExporting}>
            取消
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? "导出中..." : "开始导出"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
