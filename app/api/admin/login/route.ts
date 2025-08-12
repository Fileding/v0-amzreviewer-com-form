import { type NextRequest, NextResponse } from "next/server"
import { verifyAdmin, generateSessionToken } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "用户名和密码不能为空" }, { status: 400 })
    }

    const admin = await verifyAdmin(username, password)

    if (!admin) {
      return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 })
    }

    const token = generateSessionToken(admin)

    // 设置HTTP-only cookie
    const cookieStore = cookies()
    cookieStore.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24小时
      path: "/",
    })

    return NextResponse.json({
      message: "登录成功",
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}
