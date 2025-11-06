# Shopify Admin MCP Server

MCP server for executing GraphQL and ShopifyQL queries against the Shopify Admin API. Query products, orders, customers, inventory, analytics, and more.

## Features

- ✅ Execute GraphQL queries (products, orders, customers, mutations)
- ✅ Execute ShopifyQL queries (analytics, conversion funnels)
- ✅ Access product conversion funnel metrics
- ✅ Query sales, orders, customers, and payment data
- ✅ Formatted output + raw JSON
- ✅ Full error handling and validation

## Installation

```bash
cd shopify-admin-mcp
npm install
npm run build
```

## Configuration

### 1. Create a Shopify Custom App

1. Go to Shopify Admin > Settings > Apps and sales channels
2. Click "Develop apps"
3. Create a new app
4. Configure Admin API scopes:
   - **Required:** `read_reports` (for ShopifyQL)
5. Install the app and copy the Admin API access token

### 2. Set Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```bash
SHOPIFY_SHOP_URL=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SHOPIFY_API_VERSION=2024-10
```

### 3. Add to Claude Desktop MCP Configuration

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows:** `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "shopify-admin": {
      "command": "node",
      "args": ["/path/to/shopify-admin-mcp/build/index.js"],
      "env": {
        "SHOPIFY_SHOP_URL": "your-store.myshopify.com",
        "SHOPIFY_ACCESS_TOKEN": "shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "SHOPIFY_API_VERSION": "2024-10"
      }
    }
  }
}
```

## Usage

### Available Tools

**`execute_graphql`** - Execute GraphQL queries and mutations

**Parameters:**
- `query` (string, required): GraphQL query or mutation string
- `variables` (object, optional): GraphQL variables

**`execute_shopifyql`** - Execute ShopifyQL analytics queries

**Parameters:**
- `query` (string, required): ShopifyQL query string

### Example Queries

#### GraphQL Examples

**Get Products:**
```graphql
query {
  products(first: 10) {
    edges {
      node {
        id
        title
        status
        vendor
        priceRangeV2 {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
}
```

**Get Orders:**
```graphql
query {
  orders(first: 10, reverse: true) {
    edges {
      node {
        id
        name
        createdAt
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        lineItems(first: 5) {
          edges {
            node {
              title
              quantity
            }
          }
        }
      }
    }
  }
}
```

**Update Product:**
```graphql
mutation {
  productUpdate(
    input: {
      id: "gid://shopify/Product/123456789"
      title: "Updated Product Title"
    }
  ) {
    product {
      id
      title
    }
    userErrors {
      field
      message
    }
  }
}
```

#### ShopifyQL Examples

#### Product Conversion Funnel

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

This gives you:
- Product views (impressions)
- Add to carts
- Checkouts started
- Purchases completed
- Conversion rates at each funnel stage
- Revenue per product

#### Top Selling Products

```shopifyql
FROM products
SHOW product_title, sum(gross_sales) AS revenue
GROUP BY product_title
SINCE -7d
ORDER BY revenue DESC
LIMIT 10
```

#### Monthly Sales Trends

```shopifyql
FROM sales
SHOW total_sales
GROUP BY month
SINCE -6m
ORDER BY month
```

#### Customer Acquisition

```shopifyql
FROM orders
SHOW count(distinct customer_id) AS new_customers
WHERE customer_type = 'first_time'
SINCE -30d
```

## Available Datasets

### Products Dataset
Access product performance metrics including:
- `view_sessions` - Product page views
- `cart_sessions` - Add to cart events
- `checkout_sessions` - Checkouts started
- `purchase_sessions` - Purchases completed
- `gross_sales`, `net_sales` - Revenue metrics
- Conversion rates: `view_to_cart_rate`, `view_cart_to_checkout_rate`, `checkout_to_purchase_rate`

[Full products dataset reference](https://shopify.dev/docs/api/shopifyql/datasets/products-dataset)

### Orders Dataset
Query order data including:
- `gross_sales`, `net_sales`, `returns`
- `ordered_product_quantity`, `returned_product_quantity`
- `shipping`, `taxes`, `tips`, `discounts`
- Dimensional attributes: `customer_type`, `channel_name`, `billing_country`

[Full orders dataset reference](https://shopify.dev/docs/api/shopifyql/datasets/orders-dataset)

### Sales Dataset
Access aggregated sales metrics

### Customers Dataset
Query customer data and segments

### Payment Attempts Dataset
Analyze payment success/failure rates

## ShopifyQL Syntax

```sql
FROM { table_name }
SHOW { column1, column2, ... }
WHERE { condition }
GROUP BY { dimension }
SINCE { date_offset }
UNTIL { date_offset }
ORDER BY { column } ASC | DESC
LIMIT { number }
```

### Time Ranges
- `SINCE -30d` - Last 30 days
- `SINCE -7d` - Last 7 days
- `SINCE -6m` - Last 6 months
- `SINCE -1y` - Last 1 year

### Aggregate Functions
- `sum(column)` - Sum values
- `count(column)` - Count rows
- `count(distinct column)` - Count unique values
- `avg(column)` - Average

## Access Scopes Required

Your Shopify app needs:
- ✅ `read_reports` - Required for ShopifyQL

Optional (depending on queries):
- `read_customers` - For customer data
- `read_orders` - For order data
- `read_products` - For product metadata

## Response Format

The MCP tool returns:
1. **Markdown table** - Human-readable results
2. **Raw JSON** - Programmatic access to data

Example response:

```markdown
# ShopifyQL Query Results

**Query:** `FROM products SHOW product_title, sum(view_sessions) SINCE -7d LIMIT 5`

| Product Title | Total Views |
| --- | --- |
| Blue T-Shirt | 1234 |
| Red Hat | 987 |
| Green Shoes | 654 |

**Total rows:** 3

## Raw Data

{
  "columns": [...],
  "rows": [...]
}
```

## Error Handling

The server handles:
- ❌ Invalid ShopifyQL syntax → Returns parse errors
- ❌ Authentication failures → Returns HTTP errors
- ❌ Missing scopes → Returns permission errors
- ❌ Invalid queries → Returns validation errors

## Troubleshooting

### "Access denied" errors
- Verify `read_reports` scope is enabled
- Check access token is valid
- Ensure app is installed on the store

### "Parse error" in ShopifyQL
- Check query syntax against [ShopifyQL reference](https://help.shopify.com/manual/reports-and-analytics/shopify-reports/report-types/shopifyql-editor/shopifyql-syntax)
- Validate column names exist in dataset
- Ensure aggregate functions are used correctly

### No data returned
- Verify date range has data (`SINCE -30d`)
- Check filters aren't too restrictive
- Confirm store has relevant data

## Development

```bash
# Build
npm run build

# Watch mode
npm run watch

# Test directly
node build/index.js
```

## References

- [ShopifyQL for Analytics](https://shopify.dev/docs/beta/shopifyql-for-analytics)
- [ShopifyQL Syntax Reference](https://help.shopify.com/manual/reports-and-analytics/shopify-reports/report-types/shopifyql-editor/shopifyql-syntax)
- [Products Dataset](https://shopify.dev/docs/api/shopifyql/datasets/products-dataset)
- [Orders Dataset](https://shopify.dev/docs/api/shopifyql/datasets/orders-dataset)
- [Model Context Protocol](https://modelcontextprotocol.io)

## License

MIT
