import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = cookies()

    // 清除认证cookie
    cookieStore.set("admin-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    })

    return NextResponse.json({ message: "登出成功" })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}
