import CustomerOrderForm from "@/components/customer-order-form"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AMZ Reviewer</h1>
          <p className="text-lg text-gray-600">专业的亚马逊订单信息管理平台</p>
        </div>

        <CustomerOrderForm />
        <Toaster />
      </div>
    </div>
  )
}
