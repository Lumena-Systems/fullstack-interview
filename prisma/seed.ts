import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const BRANDS = [
  'Nike',
  'Adidas',
  'Apple',
  'Samsung',
  'Sony',
  'LG',
  'Dell',
  'HP',
  'Lenovo',
  'Asus',
  'Microsoft',
  'Google',
  'Amazon',
  'IKEA',
  'Wayfair',
  'West Elm',
  'Crate & Barrel',
  'Pottery Barn',
  'Target',
  'Walmart',
  'Costco',
  'Under Armour',
  'Puma',
  'Reebok',
  'New Balance',
  'Brooks',
  'Asics',
  'Saucony',
  'Hoka',
  'Patagonia',
  'The North Face',
  'Columbia',
  'Arc\'teryx',
  'REI',
  'Lululemon',
  'Athleta',
  'Gap',
  'Old Navy',
  'Banana Republic',
  'J.Crew',
  'Madewell',
  'Everlane',
  'Uniqlo',
  'H&M',
  'Zara',
  'Forever 21',
  'Urban Outfitters',
  'Anthropologie',
  'Free People',
  'Nordstrom',
];

const CATEGORIES = [
  'Electronics',
  'Computers & Laptops',
  'Smartphones & Tablets',
  'Audio & Headphones',
  'Cameras & Photography',
  'Clothing',
  'Men\'s Clothing',
  'Women\'s Clothing',
  'Kids\' Clothing',
  'Shoes & Footwear',
  'Athletic Wear',
  'Home & Garden',
  'Furniture',
  'Kitchen & Dining',
  'Bedding & Bath',
  'Sports & Outdoors',
  'Fitness Equipment',
  'Camping & Hiking',
  'Books & Media',
  'Toys & Games',
];

const COLORS = ['Red', 'Blue', 'Green', 'Black', 'White', 'Gray', 'Navy', 'Brown', 'Beige', 'Pink', 'Purple', 'Yellow', 'Orange'];
const MATERIALS = ['Cotton', 'Polyester', 'Leather', 'Plastic', 'Metal', 'Wood', 'Glass', 'Ceramic', 'Rubber', 'Nylon'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
const STYLES = ['Casual', 'Formal', 'Sporty', 'Modern', 'Classic', 'Vintage', 'Minimalist'];

function generateProductName(): string {
  const adjectives = ['Premium', 'Deluxe', 'Pro', 'Ultra', 'Essential', 'Classic', 'Modern', 'Elite', 'Signature', 'Advanced'];
  const nouns = ['Sneakers', 'Laptop', 'Phone', 'Watch', 'Headphones', 'Shirt', 'Jacket', 'Pants', 'Chair', 'Desk', 'Sofa', 'Table', 'Lamp', 'Backpack', 'Sunglasses'];
  
  return `${faker.helpers.arrayElement(adjectives)} ${faker.helpers.arrayElement(nouns)}`;
}

function generateProductDescription(): string {
  const descriptions = [
    'Experience unmatched quality and comfort with this premium product. Perfect for everyday use.',
    'Designed with precision and crafted from the finest materials. Built to last.',
    'Elevate your style with this modern essential. Versatile and timeless.',
    'Superior performance meets exceptional design. The perfect addition to your collection.',
    'Engineered for excellence. Features cutting-edge technology and innovative design.',
    'Discover the perfect blend of functionality and aesthetics. A must-have item.',
    'Crafted with attention to detail. Combines comfort, durability, and style.',
    'Transform your space with this elegant piece. Thoughtfully designed for modern living.',
    'Premium quality at an incredible value. Don\'t miss this opportunity.',
    'The ultimate choice for those who demand the best. Exceptional in every way.',
  ];
  
  return faker.helpers.arrayElements(descriptions, faker.number.int({ min: 1, max: 3 })).join(' ');
}

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.productAttribute.deleteMany();
  await prisma.productReview.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Seed Suppliers
  console.log('🏭 Seeding suppliers...');
  const supplierNames = ['Global Manufacturing Co', 'Premier Goods Inc', 'Quality Imports Ltd', 'Pacific Distributors', 'Atlantic Supply Chain', 'European Traders', 'Asian Exports Group', 'Americas Wholesale', 'International Logistics Corp', 'Continental Suppliers'];
  const supplierData = supplierNames.map((name) => ({
    name,
    country: faker.helpers.arrayElement(['USA', 'China', 'Germany', 'Japan', 'South Korea', 'UK', 'France', 'Italy', 'Canada', 'Mexico']),
    description: faker.company.catchPhrase(),
  }));
  await prisma.supplier.createMany({ data: supplierData });
  const suppliers = await prisma.supplier.findMany();
  const supplierIds = suppliers.map((s) => s.id);

  // Seed Brands
  console.log('📦 Seeding brands...');
  const brandData = BRANDS.map((name) => ({ 
    name,
    supplierId: faker.helpers.arrayElement(supplierIds),
  }));
  await prisma.brand.createMany({ data: brandData });
  const brands = await prisma.brand.findMany();
  const brandIds = brands.map((b) => b.id);

  // Seed Categories
  console.log('🏷️  Seeding categories...');
  const categoryData = CATEGORIES.map((name) => ({ name }));
  await prisma.category.createMany({ data: categoryData });
  const categories = await prisma.category.findMany();
  const categoryIds = categories.map((c) => c.id);

  // Seed Products (200,000)
  console.log('🛍️  Seeding 200,000 products (this will take 20-30 seconds)...');
  const TOTAL_PRODUCTS = 200000;
  const BATCH_SIZE = 10000;
  
  for (let i = 0; i < TOTAL_PRODUCTS; i += BATCH_SIZE) {
    const productsBatch = [];
    for (let j = 0; j < BATCH_SIZE && i + j < TOTAL_PRODUCTS; j++) {
      const productId = i + j;
      productsBatch.push({
        name: generateProductName(),
        description: generateProductDescription(),
        price: parseFloat(faker.commerce.price({ min: 5, max: 2000, dec: 2 })),
        inventory: faker.number.int({ min: 0, max: 1000 }),
        imageUrl: `https://picsum.photos/seed/${productId}/400/400`,
        brandId: faker.helpers.arrayElement(brandIds),
        categoryId: faker.helpers.arrayElement(categoryIds),
      });
    }
    
    await prisma.product.createMany({ data: productsBatch });
    console.log(`   ✓ Seeded ${Math.min(i + BATCH_SIZE, TOTAL_PRODUCTS).toLocaleString()}/${TOTAL_PRODUCTS.toLocaleString()} products`);
  }

  // Seed Product Attributes
  console.log('🎨 Seeding product attributes...');
  const products = await prisma.product.findMany({ select: { id: true } });
  
  // Sample attributes for efficiency (add to first 50k products)
  const PRODUCTS_WITH_ATTRIBUTES = 50000;
  const attributesBatch = [];
  
  for (let i = 0; i < Math.min(PRODUCTS_WITH_ATTRIBUTES, products.length); i++) {
    const numAttributes = faker.number.int({ min: 2, max: 5 });
    const productId = products[i].id;
    
    // Add color
    attributesBatch.push({
      productId,
      key: 'Color',
      value: faker.helpers.arrayElement(COLORS),
    });
    
    // Add material
    if (numAttributes >= 2) {
      attributesBatch.push({
        productId,
        key: 'Material',
        value: faker.helpers.arrayElement(MATERIALS),
      });
    }
    
    // Add size
    if (numAttributes >= 3) {
      attributesBatch.push({
        productId,
        key: 'Size',
        value: faker.helpers.arrayElement(SIZES),
      });
    }
    
    // Add style
    if (numAttributes >= 4) {
      attributesBatch.push({
        productId,
        key: 'Style',
        value: faker.helpers.arrayElement(STYLES),
      });
    }
    
    // Add weight
    if (numAttributes >= 5) {
      attributesBatch.push({
        productId,
        key: 'Weight',
        value: faker.helpers.arrayElement(['Light', 'Medium', 'Heavy']),
      });
    }
    
    // Batch insert every 10k products
    if (attributesBatch.length >= 25000) {
      await prisma.productAttribute.createMany({ data: attributesBatch });
      attributesBatch.length = 0;
      console.log(`   ✓ Seeded attributes for ${i.toLocaleString()} products`);
    }
  }
  
  if (attributesBatch.length > 0) {
    await prisma.productAttribute.createMany({ data: attributesBatch });
  }

  // Seed Product Reviews
  console.log('⭐ Seeding product reviews...');
  const PRODUCTS_WITH_REVIEWS = 25000;
  const reviewsBatch = [];
  const reviewTitles = [
    'Great product!',
    'Highly recommend',
    'Not what I expected',
    'Amazing quality',
    'Worth every penny',
    'Disappointed',
    'Perfect for my needs',
    'Could be better',
    'Exceeded expectations',
    'Just okay',
  ];
  const reviewContents = [
    'This product is fantastic! I love the quality and design.',
    'Really impressed with how well this works. Great value for money.',
    'Not quite what I was looking for, but still decent.',
    'The build quality is outstanding. Very satisfied with my purchase.',
    'I use this every day and it never disappoints. Highly recommended!',
    'Had some issues with this product. Customer service was helpful though.',
    'Perfect fit for what I needed. Does exactly what it should.',
    'Good product but there are better options out there.',
    'This exceeded all my expectations. Best purchase I\'ve made in a while.',
    'It\'s okay, nothing special. Gets the job done.',
  ];
  
  for (let i = 0; i < Math.min(PRODUCTS_WITH_REVIEWS, products.length); i++) {
    const numReviews = faker.number.int({ min: 2, max: 8 });
    const productId = products[i].id;
    
    for (let j = 0; j < numReviews; j++) {
      reviewsBatch.push({
        productId,
        rating: faker.number.int({ min: 1, max: 5 }),
        title: faker.helpers.arrayElement(reviewTitles),
        content: faker.helpers.arrayElement(reviewContents),
        author: faker.person.fullName(),
      });
    }
    
    // Batch insert every 50k reviews
    if (reviewsBatch.length >= 50000) {
      await prisma.productReview.createMany({ data: reviewsBatch });
      reviewsBatch.length = 0;
      console.log(`   ✓ Seeded reviews for ${i.toLocaleString()} products`);
    }
  }
  
  if (reviewsBatch.length > 0) {
    await prisma.productReview.createMany({ data: reviewsBatch });
  }

  // Seed Users
  console.log('👤 Seeding test users...');
  const users = [];
  for (let i = 1; i <= 5; i++) {
    users.push({
      email: `test${i}@example.com`,
      name: `Test User ${i}`,
    });
  }
  await prisma.user.createMany({ data: users });
  const testUser1 = await prisma.user.findUnique({ where: { email: 'test1@example.com' } });

  if (testUser1) {
    // Seed Cart Items for test user 1
    console.log('🛒 Seeding cart items...');
    const randomProducts = faker.helpers.arrayElements(products, 20);
    const cartItems = randomProducts.map((p) => ({
      userId: testUser1.id,
      productId: p.id,
      quantity: faker.number.int({ min: 1, max: 5 }),
    }));
    await prisma.cartItem.createMany({ data: cartItems });

    // Seed Orders
    console.log('📦 Seeding orders...');
    for (let i = 0; i < 10; i++) {
      const orderProducts = faker.helpers.arrayElements(products, faker.number.int({ min: 2, max: 5 }));
      const orderTotal = orderProducts.reduce((sum, p) => {
        const qty = faker.number.int({ min: 1, max: 3 });
        const productData = products.find(prod => prod.id === p.id);
        return sum + (qty * 50); // Simplified total calculation
      }, 0);

      const order = await prisma.order.create({
        data: {
          userId: testUser1.id,
          total: orderTotal,
          status: faker.helpers.arrayElement(['pending', 'completed', 'completed', 'completed']),
        },
      });

      const orderItems = orderProducts.map((p) => ({
        orderId: order.id,
        productId: p.id,
        quantity: faker.number.int({ min: 1, max: 3 }),
        price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
      }));

      await prisma.orderItem.createMany({ data: orderItems });
    }
  }

  console.log('\n✅ Seed completed successfully!');
  console.log(`   • ${suppliers.length} suppliers`);
  console.log(`   • ${brands.length} brands`);
  console.log(`   • ${categories.length} categories`);
  console.log(`   • ${TOTAL_PRODUCTS.toLocaleString()} products`);
  console.log(`   • ~${Math.min(PRODUCTS_WITH_ATTRIBUTES, TOTAL_PRODUCTS).toLocaleString()} products with attributes`);
  console.log(`   • ~${Math.min(25000, TOTAL_PRODUCTS).toLocaleString()} products with reviews`);
  console.log(`   • 5 test users`);
  console.log(`   • 20 cart items for test1@example.com`);
  console.log(`   • 10 sample orders\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


