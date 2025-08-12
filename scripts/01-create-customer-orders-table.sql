-- 创建客户订单信息表
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

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_customer_orders_updated_at 
    BEFORE UPDATE ON customer_orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
