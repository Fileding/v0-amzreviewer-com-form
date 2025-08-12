"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface FormData {
  orderTime: string
  country: string
  asin: string
  keywords: string
  positionPage: string
  unitPrice: string
  hasGiftCardImage: boolean
  brandName: string
  storeName: string
  productKeywordsChinese: string
  totalOrders: string
  dailyOrders: string
  notes: string
}

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

export default function CustomerOrderForm() {
  const [formData, setFormData] = useState<FormData>({
    orderTime: "",
    country: "",
    asin: "",
    keywords: "",
    positionPage: "",
    unitPrice: "",
    hasGiftCardImage: false,
    brandName: "",
    storeName: "",
    productKeywordsChinese: "",
    totalOrders: "",
    dailyOrders: "",
    notes: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.orderTime) newErrors.orderTime = "请选择下单时间"
    if (!formData.country) newErrors.country = "请选择国家"
    if (!formData.asin) newErrors.asin = "请输入ASIN"
    if (!formData.keywords) newErrors.keywords = "请输入关键词"
    if (!formData.positionPage) newErrors.positionPage = "请输入位置页码"
    if (!formData.unitPrice) newErrors.unitPrice = "请输入客单价"
    if (!formData.totalOrders) newErrors.totalOrders = "请输入总单数"
    if (!formData.dailyOrders) newErrors.dailyOrders = "请输入每天单数"

    // 验证数字字段
    if (formData.positionPage && isNaN(Number(formData.positionPage))) {
      newErrors.positionPage = "位置页码必须是数字"
    }
    if (formData.unitPrice && isNaN(Number(formData.unitPrice))) {
      newErrors.unitPrice = "客单价必须是数字"
    }
    if (formData.totalOrders && isNaN(Number(formData.totalOrders))) {
      newErrors.totalOrders = "总单数必须是数字"
    }
    if (formData.dailyOrders && isNaN(Number(formData.dailyOrders))) {
      newErrors.dailyOrders = "每天单数必须是数字"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "表单验证失败",
        description: "请检查并填写所有必填字段",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "提交成功",
          description: "您的订单信息已成功提交",
        })
        // 重置表单
        setFormData({
          orderTime: "",
          country: "",
          asin: "",
          keywords: "",
          positionPage: "",
          unitPrice: "",
          hasGiftCardImage: false,
          brandName: "",
          storeName: "",
          productKeywordsChinese: "",
          totalOrders: "",
          dailyOrders: "",
          notes: "",
        })
      } else {
        throw new Error("提交失败")
      }
    } catch (error) {
      toast({
        title: "提交失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // 清除该字段的错误
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">客户订单信息提交</CardTitle>
        <CardDescription className="text-center">请填写完整的订单信息，所有标记*的字段为必填项</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本订单信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orderTime">下单时间 *</Label>
              <Input
                id="orderTime"
                type="datetime-local"
                value={formData.orderTime}
                onChange={(e) => handleInputChange("orderTime", e.target.value)}
                className={errors.orderTime ? "border-red-500" : ""}
              />
              {errors.orderTime && <p className="text-sm text-red-500">{errors.orderTime}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">国家 *</Label>
              <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                <SelectTrigger className={errors.country ? "border-red-500" : ""}>
                  <SelectValue placeholder="选择国家" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="asin">ASIN *</Label>
              <Input
                id="asin"
                value={formData.asin}
                onChange={(e) => handleInputChange("asin", e.target.value)}
                placeholder="输入产品ASIN"
                className={errors.asin ? "border-red-500" : ""}
              />
              {errors.asin && <p className="text-sm text-red-500">{errors.asin}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="positionPage">位置(页码) *</Label>
              <Input
                id="positionPage"
                type="number"
                value={formData.positionPage}
                onChange={(e) => handleInputChange("positionPage", e.target.value)}
                placeholder="输入页码"
                className={errors.positionPage ? "border-red-500" : ""}
              />
              {errors.positionPage && <p className="text-sm text-red-500">{errors.positionPage}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">关键词 *</Label>
            <Input
              id="keywords"
              value={formData.keywords}
              onChange={(e) => handleInputChange("keywords", e.target.value)}
              placeholder="输入搜索关键词"
              className={errors.keywords ? "border-red-500" : ""}
            />
            {errors.keywords && <p className="text-sm text-red-500">{errors.keywords}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unitPrice">客单价 *</Label>
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                value={formData.unitPrice}
                onChange={(e) => handleInputChange("unitPrice", e.target.value)}
                placeholder="输入单价"
                className={errors.unitPrice ? "border-red-500" : ""}
              />
              {errors.unitPrice && <p className="text-sm text-red-500">{errors.unitPrice}</p>}
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <Checkbox
                id="hasGiftCardImage"
                checked={formData.hasGiftCardImage}
                onCheckedChange={(checked) => handleInputChange("hasGiftCardImage", checked as boolean)}
              />
              <Label htmlFor="hasGiftCardImage">主图是否放礼品卡</Label>
            </div>
          </div>

          {/* 产品信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brandName">品牌名</Label>
              <Input
                id="brandName"
                value={formData.brandName}
                onChange={(e) => handleInputChange("brandName", e.target.value)}
                placeholder="输入品牌名"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeName">店铺名</Label>
              <Input
                id="storeName"
                value={formData.storeName}
                onChange={(e) => handleInputChange("storeName", e.target.value)}
                placeholder="输入店铺名"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="productKeywordsChinese">产品关键词中文名</Label>
            <Input
              id="productKeywordsChinese"
              value={formData.productKeywordsChinese}
              onChange={(e) => handleInputChange("productKeywordsChinese", e.target.value)}
              placeholder="输入产品中文关键词"
            />
          </div>

          {/* 订单数量 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalOrders">总单数 *</Label>
              <Input
                id="totalOrders"
                type="number"
                value={formData.totalOrders}
                onChange={(e) => handleInputChange("totalOrders", e.target.value)}
                placeholder="输入总单数"
                className={errors.totalOrders ? "border-red-500" : ""}
              />
              {errors.totalOrders && <p className="text-sm text-red-500">{errors.totalOrders}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dailyOrders">每天单数 *</Label>
              <Input
                id="dailyOrders"
                type="number"
                value={formData.dailyOrders}
                onChange={(e) => handleInputChange("dailyOrders", e.target.value)}
                placeholder="输入每天单数"
                className={errors.dailyOrders ? "border-red-500" : ""}
              />
              {errors.dailyOrders && <p className="text-sm text-red-500">{errors.dailyOrders}</p>}
            </div>
          </div>

          {/* 备注 */}
          <div className="space-y-2">
            <Label htmlFor="notes">备注(星级、是否带图等)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="输入备注信息，如星级要求、是否需要带图等"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                提交中...
              </>
            ) : (
              "提交订单信息"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
