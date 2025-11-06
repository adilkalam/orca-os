# ShopifyQL Query Examples

Example queries you can run with the Shopify Admin MCP server.

## Product Analytics

### Product Conversion Funnel (Complete Metrics)

This is the exact query from your requirement - shows the complete conversion funnel for products:

```shopifyql
FROM products
SHOW
  product_title,
  sum(view_sessions) AS total_views,
  sum(cart_sessions) AS total_add_to_carts,
  sum(checkout_sessions) AS total_checkouts,
  sum(purchase_sessions) AS total_purchases,
  view_to_cart_rate,
  view_cart_to_checkout_rate,
  checkout_to_purchase_rate,
  sum(gross_sales) AS revenue
GROUP BY product_title
SINCE -30d
ORDER BY total_views DESC
LIMIT 20
```

**What you get:**
- Product views (impressions)
- Add to cart events
- Checkouts started
- Purchases completed
- Conversion rate from view → cart
- Conversion rate from view+cart → checkout
- Conversion rate from checkout → purchase
- Total revenue per product

### Top Viewed Products

```shopifyql
FROM products
SHOW
  product_title,
  sum(view_sessions) AS views,
  sum(purchase_sessions) AS purchases
GROUP BY product_title
SINCE -7d
ORDER BY views DESC
LIMIT 10
```

### Products with Best Cart Conversion

```shopifyql
FROM products
SHOW
  product_title,
  sum(view_sessions) AS views,
  sum(cart_sessions) AS carts,
  view_to_cart_rate
WHERE view_sessions > 0
GROUP BY product_title
SINCE -30d
ORDER BY view_to_cart_rate DESC
LIMIT 20
```

### Products with Low Checkout Completion

Find products where customers add to cart but don't complete purchase:

```shopifyql
FROM products
SHOW
  product_title,
  sum(cart_sessions) AS carts,
  sum(checkout_sessions) AS checkouts,
  sum(purchase_sessions) AS purchases,
  checkout_to_purchase_rate
WHERE cart_sessions > 10
GROUP BY product_title
SINCE -30d
ORDER BY checkout_to_purchase_rate ASC
LIMIT 20
```

### Revenue by Product

```shopifyql
FROM products
SHOW
  product_title,
  sum(gross_sales) AS revenue,
  sum(purchase_sessions) AS orders,
  avg(gross_sales / purchase_sessions) AS avg_order_value
WHERE purchase_sessions > 0
GROUP BY product_title
SINCE -30d
ORDER BY revenue DESC
LIMIT 20
```

## Sales Analytics

### Daily Sales Trend

```shopifyql
FROM sales
SHOW
  day,
  total_sales
GROUP BY day
SINCE -30d
ORDER BY day
```

### Monthly Sales Summary

```shopifyql
FROM sales
SHOW
  month,
  total_sales,
  orders_count
GROUP BY month
SINCE -12m
ORDER BY month
```

### Sales by Channel

```shopifyql
FROM sales
SHOW
  channel_name,
  sum(total_sales) AS revenue
GROUP BY channel_name
SINCE -30d
ORDER BY revenue DESC
```

## Order Analytics

### Order Volume by Day

```shopifyql
FROM orders
SHOW
  day,
  count(orders) AS order_count,
  sum(gross_sales) AS revenue
GROUP BY day
SINCE -30d
ORDER BY day
```

### Average Order Value

```shopifyql
FROM orders
SHOW
  avg(gross_sales) AS avg_order_value,
  avg(net_sales) AS avg_net_sales,
  count(orders) AS total_orders
SINCE -30d
```

### Returns Analysis

```shopifyql
FROM orders
SHOW
  day,
  sum(returns) AS returned_value,
  sum(returned_product_quantity) AS items_returned,
  count(orders) AS orders_with_returns
WHERE returns > 0
GROUP BY day
SINCE -30d
ORDER BY day
```

### Orders by Country

```shopifyql
FROM orders
SHOW
  billing_country,
  count(orders) AS order_count,
  sum(gross_sales) AS revenue
GROUP BY billing_country
SINCE -30d
ORDER BY revenue DESC
LIMIT 20
```

### First-time vs Returning Customers

```shopifyql
FROM orders
SHOW
  customer_type,
  count(orders) AS order_count,
  sum(gross_sales) AS revenue,
  avg(gross_sales) AS avg_order_value
GROUP BY customer_type
SINCE -30d
```

## Customer Analytics

### New Customer Acquisition

```shopifyql
FROM orders
SHOW
  day,
  count(distinct customer_id) AS new_customers
WHERE customer_type = 'first_time'
GROUP BY day
SINCE -30d
ORDER BY day
```

### Customer Lifetime Orders

```shopifyql
FROM orders
SHOW
  customer_id,
  count(orders) AS total_orders,
  sum(gross_sales) AS lifetime_value
GROUP BY customer_id
SINCE -1y
ORDER BY lifetime_value DESC
LIMIT 100
```

## Discount Analytics

### Discount Usage

```shopifyql
FROM orders
SHOW
  day,
  sum(discounts) AS total_discounts,
  sum(gross_sales) AS gross_sales,
  (sum(discounts) / sum(gross_sales)) * 100 AS discount_rate_pct
GROUP BY day
SINCE -30d
ORDER BY day
```

## Shipping Analytics

### Shipping Revenue

```shopifyql
FROM orders
SHOW
  day,
  sum(shipping) AS shipping_revenue,
  count(orders) AS orders,
  avg(shipping) AS avg_shipping_per_order
GROUP BY day
SINCE -30d
ORDER BY day
```

## Time Comparisons

### Week-over-Week Sales

```shopifyql
FROM sales
SHOW
  week,
  total_sales
GROUP BY week
SINCE -8w
ORDER BY week
```

### Month-over-Month Growth

```shopifyql
FROM sales
SHOW
  month,
  total_sales
GROUP BY month
SINCE -12m
ORDER BY month
```

## Advanced Queries

### Product Performance Matrix

```shopifyql
FROM products
SHOW
  product_title,
  sum(view_sessions) AS impressions,
  sum(cart_sessions) AS add_to_carts,
  sum(purchase_sessions) AS conversions,
  view_to_cart_rate AS view_to_cart_pct,
  checkout_to_purchase_rate AS checkout_to_purchase_pct,
  sum(gross_sales) AS revenue,
  avg(gross_sales / purchase_sessions) AS avg_sale_value
WHERE view_sessions > 50
GROUP BY product_title
SINCE -30d
ORDER BY revenue DESC
LIMIT 50
```

### High-Intent Low-Conversion Products

Find products with high cart additions but low purchases (potential issues with price, shipping, or checkout):

```shopifyql
FROM products
SHOW
  product_title,
  sum(cart_sessions) AS carts,
  sum(purchase_sessions) AS purchases,
  checkout_to_purchase_rate,
  sum(gross_sales) AS revenue
WHERE cart_sessions > 20
  AND checkout_to_purchase_rate < 50
GROUP BY product_title
SINCE -30d
ORDER BY carts DESC
LIMIT 20
```

## Tips

### Date Ranges
- `-7d` = Last 7 days
- `-30d` = Last 30 days
- `-3m` = Last 3 months
- `-1y` = Last year
- `SINCE -30d UNTIL -7d` = 30 days ago to 7 days ago (excluding last week)

### Filtering
```shopifyql
WHERE view_sessions > 100
WHERE customer_type = 'returning'
WHERE billing_country = 'US'
WHERE returns > 0
```

### Grouping
```shopifyql
GROUP BY product_title
GROUP BY day
GROUP BY week
GROUP BY month
GROUP BY billing_country
GROUP BY channel_name
```

### Aggregate Functions
- `sum(column)` - Total
- `avg(column)` - Average
- `count(column)` - Count
- `count(distinct column)` - Unique count
- `min(column)` - Minimum
- `max(column)` - Maximum

### Calculated Fields
```shopifyql
sum(gross_sales) / count(orders) AS avg_order_value
(sum(discounts) / sum(gross_sales)) * 100 AS discount_pct
sum(returns) / sum(gross_sales) AS return_rate
```

## Error Handling

If you get parse errors, check:
1. ✅ Column names are spelled correctly
2. ✅ Aggregate functions used on numeric columns
3. ✅ GROUP BY includes all non-aggregated columns
4. ✅ Date ranges are valid
5. ✅ Parentheses are balanced in calculations

## Testing Your Queries

Start with simple queries and build up:

```shopifyql
-- Step 1: Basic query
FROM products
SHOW product_title
LIMIT 5

-- Step 2: Add aggregation
FROM products
SHOW product_title, sum(view_sessions)
GROUP BY product_title
LIMIT 5

-- Step 3: Add date filter
FROM products
SHOW product_title, sum(view_sessions) AS views
GROUP BY product_title
SINCE -7d
LIMIT 5

-- Step 4: Add ordering
FROM products
SHOW product_title, sum(view_sessions) AS views
GROUP BY product_title
SINCE -7d
ORDER BY views DESC
LIMIT 5
```

## References

- [ShopifyQL Syntax](https://help.shopify.com/manual/reports-and-analytics/shopify-reports/report-types/shopifyql-editor/shopifyql-syntax)
- [Products Dataset](https://shopify.dev/docs/api/shopifyql/datasets/products-dataset)
- [Orders Dataset](https://shopify.dev/docs/api/shopifyql/datasets/orders-dataset)
