-- 删除现有管理员记录（如果存在）
DELETE FROM admin_users WHERE username = 'admin';

-- 插入新的管理员记录，使用bcrypt哈希密码
-- 密码: Admin123!@# 
-- 哈希: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT INTO admin_users (username, email, password_hash, is_active, created_at, updated_at)
VALUES (
  'admin',
  'admin@amzreviewer.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  true,
  NOW(),
  NOW()
);
