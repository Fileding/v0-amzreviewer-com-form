import { headers } from "next/headers"
import AdminHeader from "@/components/admin-header"
import OrdersTable from "@/components/orders-table"
import { Toaster } from "@/components/ui/toaster"

export default function AdminDashboard() {
  const headersList = headers()
  const adminUsername = headersList.get("x-admin-username") || "管理员"

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader adminUsername={adminUsername} />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">订单数据管理</h2>
          <p className="text-gray-600">查看和管理客户提交的订单信息</p>
        </div>

        <OrdersTable />
        <Toaster />
      </main>
    </div>
  )
}
