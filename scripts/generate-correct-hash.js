const bcrypt = require("bcrypt")

async function generateHash() {
  const password = "Admin123!@#"
  const saltRounds = 12

  try {
    const hash = await bcrypt.hash(password, saltRounds)
    console.log("Password:", password)
    console.log("Generated Hash:", hash)

    // 验证哈希是否正确
    const isValid = await bcrypt.compare(password, hash)
    console.log("Hash verification:", isValid)

    // 输出SQL更新语句
    console.log("\nSQL Update Statement:")
    console.log(`UPDATE admin_users SET password_hash = '${hash}' WHERE username = 'admin';`)
  } catch (error) {
    console.error("Error generating hash:", error)
  }
}

generateHash()
