import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const supabase = createServerClient()

    // 检查admin_users表是否存在
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_name", "admin_users")

    if (tablesError) {
      return NextResponse.json(
        {
          error: "无法查询表信息",
          details: tablesError.message,
        },
        { status: 500 },
      )
    }

    // 检查管理员记录
    const { data: admins, error: adminsError } = await supabase.from("admin_users").select("*")

    if (adminsError) {
      return NextResponse.json(
        {
          error: "无法查询管理员记录",
          details: adminsError.message,
        },
        { status: 500 },
      )
    }

    // 生成正确的密码哈希用于比较
    const correctHash = await bcrypt.hash("Admin123!@#", 10)

    return NextResponse.json({
      tablesExist: tables?.length > 0,
      adminCount: admins?.length || 0,
      admins: admins?.map((admin) => ({
        id: admin.id,
        username: admin.username,
        email: admin.email,
        is_active: admin.is_active,
        has_password: !!admin.password_hash,
        password_length: admin.password_hash?.length || 0,
      })),
      correctHashSample: correctHash,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "调试查询失败",
        details: error instanceof Error ? error.message : "未知错误",
      },
      { status: 500 },
    )
  }
}
