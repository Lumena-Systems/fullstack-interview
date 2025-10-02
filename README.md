# Frontend Engineering Interview

This is an e-commerce product catalog application for technical interviews.

## 🎯 Overview

The application is a fully functional product management dashboard built with Next.js.

## 🚀 Setup

### Prerequisites

- Node.js 18+ 
- pnpm (install with `npm install -g pnpm`)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd frontend-interview

# Install dependencies
pnpm install

# Set up the database
pnpm db:push

# Seed with 200,000 products (takes ~20-30 seconds)
pnpm db:seed

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Quick Setup (One Command)

```bash
pnpm setup
```

This runs `install`, `db:push`, and `db:seed` in sequence.

## 📋 What to Expect

This application works as a product management system. During the interview, you'll be asked to:

1. **Explore** the codebase and understand the architecture
2. **Identify** any issues or areas for improvement
3. **Implement** solutions with production-quality code
4. **Discuss** alternative approaches and trade-offs

The interviewer will guide you through different scenarios during the session.

## 🏗️ Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui components
- **Data Fetching:** React Query (TanStack Query)
- **Backend:** Next.js API routes
- **Database:** Prisma ORM + SQLite (200k products)
- **Package Manager:** pnpm

## 📁 Project Structure

```
app/
├── api/                  # API routes
│   ├── products/        # Product endpoints
│   ├── cart/            # Shopping cart endpoints
│   └── shipping-estimate/  # Shipping estimate endpoint
├── products/            # Product pages
│   ├── page.tsx        # Product catalog with filters
│   └── [id]/page.tsx   # Product detail page
├── cart/                # Shopping cart page
└── layout.tsx           # Root layout

components/
├── ProductCard.tsx      # Individual product card
├── ProductGrid.tsx      # Product grid with loading states
├── ShippingEstimate.tsx # Shipping estimate component
├── SearchBar.tsx        # Search input
├── CartItem.tsx         # Cart item component
├── ExportButton.tsx     # CSV export button
└── ui/                  # shadcn/ui components

prisma/
├── schema.prisma        # Database schema
└── seed.ts              # Seed script (generates 200k products)
```

## 🔌 API Documentation

### Products

**GET** `/api/products`
- Query params: `page`, `limit`, `search`, `category`, `brand`
- Returns: `{ products, total, page, pageSize, totalPages }`

**GET** `/api/products/:id`
- Returns: Single product with brand, category, and attributes

**GET** `/api/products/count`
- Returns: `{ count }` 

**GET** `/api/products/export`
- Returns: All products as JSON 

**GET** `/api/products/search?q=query`
- Returns: Products matching search across multiple fields 

### Cart

**GET** `/api/cart`
- Returns: Current user's cart items with products

**POST** `/api/cart`
- Body: `{ productId, quantity }`
- Returns: Created/updated cart item

**PATCH** `/api/cart/:id`
- Body: `{ quantity }`
- Returns: Updated cart item

**DELETE** `/api/cart/:id`
- Returns: `{ success: true }`

### Other

**GET** `/api/filters`
- Returns: `{ brands, categories }` for filtering

**GET** `/api/shipping-estimate/:id`
- Returns: `{ days }` 

## 🎨 Features

### Product Catalog
- Browse 200,000 products with pagination (50 per page)
- Search products by name
- Filter by category and brand
- View product details
- Add products to cart
- Export products to CSV

### Shopping Cart
- View cart items
- Update quantities
- Remove items
- See subtotal, tax, and total

### Product Details
- Full product information
- Image gallery
- Product attributes (color, size, material, etc.)
- Stock availability
- Add to cart with quantity selector

## 🔧 Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

pnpm db:generate  # Generate Prisma client
pnpm db:push      # Push schema to database
pnpm db:seed      # Seed database with test data
pnpm db:reset     # Reset database and reseed

pnpm setup        # Complete setup (install + db:push + db:seed)
```

## 📝 Notes

- **No Authentication:** For simplicity, the app uses a hardcoded test user (`test1@example.com`)
- **SQLite Database:** Easy local setup, no Docker required
- **Test Data:** Seeds 200k products, 50 brands, 20 categories, 5 users
- **Image URLs:** Uses placeholder images from Picsum Photos

## 🤔 Interview Tips

- Feel free to ask questions about the codebase
- Think out loud - explain your reasoning
- Consider both short-term fixes and long-term solutions
- Discuss trade-offs between different approaches
- Use browser DevTools to inspect network and performance
- Check the console for useful information

## User complaints, please investigate in order

- Computing the count is slow
- Search feels laggy when typing - users report the page is unresponsive while searching (focus only on frontend part)
- Shopping cart page feels sluggish when updating item quantities
- Product listing page is slow to fully load - users see a long delay before all product information appears
- Even once some products load, the images are not loading for a while. 
- CSV export causes browser to hang for 10+ seconds with our full catalog
- Even after search improvement to the frontend, search is still slow. 

*With 10 minutes left, we'll work on a design question:*

We need to allow admins to update prices for thousands of products at once by uploading a CSV file. The CSV contains product IDs and new prices, and we expect files with 20k-50k rows regularly. Design an API endpoint (or set of endpoints) to handle this feature, considering our current tech stack and the scale of updates.

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

## 🙋 Questions?

If you have any questions about the setup or requirements, please ask your interviewer. Good luck! 🚀


