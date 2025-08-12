-- 插入明文密码的管理员账户用于测试
DELETE FROM admin_users WHERE username = 'admin';

INSERT INTO admin_users (username, email, password_hash, is_active, created_at, updated_at)
VALUES (
  'admin',
  'admin@amzreviewer.com',
  'Admin123!@#',
  true,
  NOW(),
  NOW()
);
