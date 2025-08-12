-- 创建客户订单表
CREATE TABLE IF NOT EXISTS public.customer_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 订单基本信息
    order_time TIMESTAMP WITH TIME ZONE NOT NULL,
    country VARCHAR(100) NOT NULL,
    asin VARCHAR(50) NOT NULL,
    keywords TEXT NOT NULL,
    position_page INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    has_gift_card BOOLEAN DEFAULT FALSE,
    notes TEXT,
    
    -- 产品信息
    brand_name VARCHAR(200) NOT NULL,
    store_name VARCHAR(200) NOT NULL,
    product_keywords_cn TEXT NOT NULL,
    total_orders INTEGER NOT NULL DEFAULT 1,
    daily_orders INTEGER NOT NULL DEFAULT 1,
    
    -- 状态字段
    status VARCHAR(50) DEFAULT 'pending'
);

-- 创建索引提高查询性能
CREATE INDEX IF NOT EXISTS idx_customer_orders_created_at ON public.customer_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_customer_orders_country ON public.customer_orders(country);
CREATE INDEX IF NOT EXISTS idx_customer_orders_asin ON public.customer_orders(asin);

-- 插入一些测试数据
INSERT INTO public.customer_orders (
    order_time, country, asin, keywords, position_page, unit_price, 
    has_gift_card, notes, brand_name, store_name, product_keywords_cn, 
    total_orders, daily_orders, status
) VALUES 
(
    NOW() - INTERVAL '1 day',
    '美国',
    'B08N5WRWNW',
    'wireless headphones',
    1,
    29.99,
    true,
    '5星评价，带图片',
    'SoundTech',
    'SoundTech Official Store',
    '无线耳机 蓝牙耳机',
    10,
    2,
    'completed'
),
(
    NOW() - INTERVAL '2 hours',
    '英国',
    'B07XJ8C8F5',
    'phone case',
    2,
    15.99,
    false,
    '4星评价',
    'CaseMaster',
    'CaseMaster UK',
    '手机壳 保护套',
    5,
    1,
    'pending'
),
(
    NOW() - INTERVAL '3 days',
    '德国',
    'B09KMJH7G3',
    'laptop stand',
    1,
    45.00,
    true,
    '5星评价，详细评论',
    'DeskPro',
    'DeskPro Germany',
    '笔记本支架 电脑支架',
    8,
    1,
    'completed'
);
