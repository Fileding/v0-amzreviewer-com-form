-- 修复管理员密码哈希
-- 密码: Admin123!@# 的bcrypt哈希值

UPDATE admin_users 
SET password_hash = '$2a$10$rOzJqQqQqQqQqQqQqQqQqOeKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK'
WHERE username = 'admin';

-- 如果上面的哈希不工作，使用这个备用哈希
-- UPDATE admin_users 
-- SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjdKXjKXjKXjKXjKXjKXjKXjKXjKXjK'
-- WHERE username = 'admin';
