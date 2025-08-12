// 生成正确的密码哈希的Node.js脚本
const bcrypt = require("bcryptjs")

async function generateHash() {
  const password = "Admin123!@#"
  const saltRounds = 10

  try {
    const hash = await bcrypt.hash(password, saltRounds)
    console.log("Password:", password)
    console.log("Hash:", hash)

    // 验证哈希是否正确
    const isValid = await bcrypt.compare(password, hash)
    console.log("Hash verification:", isValid)

    console.log("\nSQL to update admin password:")
    console.log(`UPDATE admin_users SET password_hash = '${hash}' WHERE username = 'admin';`)
  } catch (error) {
    console.error("Error generating hash:", error)
  }
}

generateHash()
