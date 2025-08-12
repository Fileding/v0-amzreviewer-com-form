-- 删除现有管理员并重新创建，使用正确的密码哈希
DELETE FROM admin_users WHERE username = 'admin';

-- 插入管理员账号，密码: Admin123!@#
-- 使用bcrypt哈希 (saltRounds = 10)
INSERT INTO admin_users (id, username, email, password_hash, is_active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin',
  'admin@amzreviewer.com',
  '$2a$10$YourActualHashWillBeGeneratedHere.Replace.This.With.Real.Hash.From.Script',
  true,
  NOW(),
  NOW()
);
