-- 创建客户订单信息表（简化版本）
CREATE TABLE IF NOT EXISTS customer_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 订单基本信息
  order_time TIMESTAMP WITH TIME ZONE NOT NULL,
  country VARCHAR(100) NOT NULL,
  asin VARCHAR(20) NOT NULL,
  keywords TEXT NOT NULL,
  position_page INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  
  -- 产品信息
  has_gift_card_image BOOLEAN DEFAULT FALSE,
  brand_name VARCHAR(200),
  store_name VARCHAR(200),
  product_keywords_chinese TEXT,
  
  -- 订单数量
  total_orders INTEGER NOT NULL DEFAULT 1,
  daily_orders INTEGER NOT NULL DEFAULT 1,
  
  -- 备注信息
  notes TEXT,
  
  -- 索引字段
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_customer_orders_created_at ON customer_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_customer_orders_country ON customer_orders(country);
CREATE INDEX IF NOT EXISTS idx_customer_orders_asin ON customer_orders(asin);
CREATE INDEX IF NOT EXISTS idx_customer_orders_brand_name ON customer_orders(brand_name);

-- 插入一些测试数据
INSERT INTO customer_orders (
  order_time, country, asin, keywords, position_page, unit_price,
  has_gift_card_image, brand_name, store_name, product_keywords_chinese,
  total_orders, daily_orders, notes
) VALUES 
(
  NOW() - INTERVAL '1 day',
  '美国',
  'B08N5WRWNW',
  'wireless headphones',
  1,
  29.99,
  true,
  'SoundTech',
  'SoundTech Official Store',
  '无线耳机 蓝牙耳机',
  5,
  2,
  '5星评价，带图评论'
),
(
  NOW() - INTERVAL '2 days',
  '英国',
  'B07XJ8C8F5',
  'phone case',
  2,
  15.99,
  false,
  'ProtectCase',
  'Mobile Accessories UK',
  '手机壳 保护套',
  3,
  1,
  '4星评价，无图'
),
(
  NOW() - INTERVAL '3 days',
  '德国',
  'B09KMJB5K3',
  'kitchen gadgets',
  1,
  24.99,
  true,
  'KitchenPro',
  'Home & Kitchen DE',
  '厨房用品 小工具',
  8,
  3,
  '5星评价，带图评论，视频'
);
