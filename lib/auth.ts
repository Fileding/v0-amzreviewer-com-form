import bcrypt from "bcryptjs"
import { createServerClient } from "@/lib/supabase/server"

export interface AdminUser {
  id: string
  username: string
  email: string
  is_active: boolean
}

// 验证密码复杂度
export function validatePassword(password: string): { isValid: boolean; message?: string } {
  if (password.length < 8) {
    return { isValid: false, message: "密码至少需要8个字符" }
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: "密码必须包含至少一个大写字母" }
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: "密码必须包含至少一个小写字母" }
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: "密码必须包含至少一个数字" }
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, message: "密码必须包含至少一个特殊字符" }
  }

  return { isValid: true }
}

// 验证管理员登录
export async function verifyAdmin(username: string, password: string): Promise<AdminUser | null> {
  try {
    const supabase = createServerClient()

    console.log("尝试登录用户:", username) // 添加调试日志

    const { data: admin, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("username", username)
      .eq("is_active", true)
      .single()

    console.log("数据库查询结果:", { admin: admin ? "找到用户" : "未找到用户", error }) // 添加调试日志

    if (error || !admin) {
      console.log("用户不存在或查询错误:", error) // 添加调试日志
      return null
    }

    console.log("开始验证密码...") // 添加调试日志

    let isValidPassword = false

    // 首先尝试明文密码比较
    if (admin.password_hash === password) {
      isValidPassword = true
      console.log("明文密码验证成功") // 添加调试日志
    } else {
      // 如果明文比较失败，尝试bcrypt比较
      try {
        isValidPassword = await bcrypt.compare(password, admin.password_hash)
        console.log("bcrypt密码验证结果:", isValidPassword) // 添加调试日志
      } catch (bcryptError) {
        console.log("bcrypt验证出错:", bcryptError) // 添加调试日志
        isValidPassword = false
      }
    }

    if (!isValidPassword) {
      return null
    }

    // 更新最后登录时间
    await supabase.from("admin_users").update({ last_login: new Date().toISOString() }).eq("id", admin.id)

    return {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      is_active: admin.is_active,
    }
  } catch (error) {
    console.error("Admin verification error:", error)
    return null
  }
}

export function generateSessionToken(admin: AdminUser): string {
  const sessionData = {
    id: admin.id,
    username: admin.username,
    email: admin.email,
    timestamp: Date.now(),
  }

  // 使用Base64编码存储会话信息
  return Buffer.from(JSON.stringify(sessionData)).toString("base64")
}

export function verifySessionToken(token: string): AdminUser | null {
  try {
    const sessionData = JSON.parse(Buffer.from(token, "base64").toString("utf8"))

    // 检查token是否过期（24小时）
    const tokenAge = Date.now() - sessionData.timestamp
    const maxAge = 24 * 60 * 60 * 1000 // 24小时

    if (tokenAge > maxAge) {
      return null
    }

    return {
      id: sessionData.id,
      username: sessionData.username,
      email: sessionData.email,
      is_active: true,
    }
  } catch (error) {
    return null
  }
}
