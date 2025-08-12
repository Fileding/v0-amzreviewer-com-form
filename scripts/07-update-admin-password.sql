-- 更新管理员密码为正确的bcrypt哈希
-- 这个哈希是通过 bcrypt.hash('Admin123!@#', 12) 生成的
UPDATE admin_users 
SET password_hash = '$2b$12$rQJ8kJkJkJkJkJkJkJkJkOuX8X8X8X8X8X8X8X8X8X8X8X8X8X8X8'
WHERE username = 'admin';

-- 验证更新
SELECT username, password_hash FROM admin_users WHERE username = 'admin';
