import { type NextRequest, NextResponse } from "next/server"
import { verifySessionToken } from "@/lib/auth"

export function middleware(request: NextRequest) {
  // 检查是否是管理员路由
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // 排除登录页面
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next()
    }

    // 检查认证token
    const token = request.cookies.get("admin-token")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    const admin = verifySessionToken(token)
    if (!admin) {
      // token无效，清除cookie并重定向到登录页
      const response = NextResponse.redirect(new URL("/admin/login", request.url))
      response.cookies.set("admin-token", "", { maxAge: 0 })
      return response
    }

    // 在请求头中添加管理员信息
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-admin-id", admin.id)
    requestHeaders.set("x-admin-username", admin.username)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
