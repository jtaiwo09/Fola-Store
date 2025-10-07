import connectDB from "@/config/database";
import User from "@/models/User";
import Category from "@/models/Category";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Review from "@/models/Review";
import { getUnsplashImages } from "@/utils/unsplash";

// Sample data
const users = [
  {
    firstName: "Admin",
    lastName: "User",
    email: "admin@luxelace.com",
    password: "Admin123!",
    role: "admin",
    phone: "+234 800 000 0001",
    isEmailVerified: true,
    isActive: true,
  },
  {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "Customer123!",
    role: "customer",
    phone: "+234 800 000 0002",
    isEmailVerified: true,
    isActive: true,
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    password: "Customer123!",
    role: "customer",
    phone: "+234 800 000 0003",
    isEmailVerified: true,
    isActive: true,
  },
  {
    firstName: "Staff",
    lastName: "Member",
    email: "staff@luxelace.com",
    password: "Staff123!",
    role: "staff",
    phone: "+234 800 000 0004",
    isEmailVerified: true,
    isActive: true,
  },
];

const categories = [
  {
    name: "Lace Materials",
    slug: "lace-materials",
    description: "Premium quality lace fabrics for all occasions",
    level: 0,
    order: 1,
    isActive: true,
  },
  {
    name: "Swiss Lace",
    slug: "swiss-lace",
    description: "High-quality Swiss lace with intricate patterns",
    level: 1,
    order: 1,
    isActive: true,
  },
  {
    name: "French Lace",
    slug: "french-lace",
    description: "Elegant French lace for sophisticated designs",
    level: 1,
    order: 2,
    isActive: true,
  },
  {
    name: "Guipure Lace",
    slug: "guipure-lace",
    description: "Bold and textured Guipure lace",
    level: 1,
    order: 3,
    isActive: true,
  },
  {
    name: "Chantilly Lace",
    slug: "chantilly-lace",
    description: "Delicate Chantilly lace with fine details",
    level: 1,
    order: 4,
    isActive: true,
  },
  {
    name: "Venetian Lace",
    slug: "venetian-lace",
    description: "Ornate Venetian lace with rich patterns",
    level: 1,
    order: 5,
    isActive: true,
  },
];

const getProducts = (categoryIds: any) => [
  {
    name: "Premium Swiss Lace - Floral Pattern",
    slug: "premium-swiss-lace-floral-pattern",
    description:
      "This exquisite Swiss lace material features intricate floral patterns and exceptional quality. Perfect for bridal wear, evening gowns, and special occasion garments. Each yard is carefully crafted to ensure consistent pattern and superior durability. The delicate yet strong weave makes it ideal for overlays, sleeves, and bodice details.",
    shortDescription: "Premium Swiss lace with intricate floral patterns",
    category: categoryIds["Swiss Lace"],
    tags: ["swiss", "lace", "floral", "bridal", "premium"],
    productType: "fabric",
    basePrice: 4500,
    salePrice: 3800,
    currency: "NGN",
    fabricType: "Swiss Lace",
    unitOfMeasure: "yard",
    minimumOrder: 2,
    maximumOrder: 50,
    variants: [
      {
        sku: "SL-FP-WHT-001",
        color: "White",
        colorHex: "#FFFFFF",
        images: [
          "https://images.unsplash.com/photo-1558769132-cb1aea28c75b?w=600",
          "https://images.unsplash.com/photo-1558769132-cb1aea28c75b?w=700",
        ],
        stock: 120,
        isAvailable: true,
      },
      {
        sku: "SL-FP-IVY-001",
        color: "Ivory",
        colorHex: "#FFFFF0",
        images: [
          "https://images.unsplash.com/photo-1558769132-6ba4e7e8b836?w=600",
          "https://images.unsplash.com/photo-1558769132-6ba4e7e8b836?w=700",
        ],
        stock: 95,
        isAvailable: true,
      },
      {
        sku: "SL-FP-CHP-001",
        color: "Champagne",
        colorHex: "#F7E7CE",
        images: [
          "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600",
        ],
        stock: 80,
        isAvailable: true,
      },
      {
        sku: "SL-FP-BLK-001",
        color: "Black",
        colorHex: "#000000",
        images: [
          "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=600",
        ],
        stock: 65,
        isAvailable: true,
      },
    ],
    specifications: {
      width: "52 inches",
      weight: "Light to Medium",
      composition: "100% Polyester",
      careInstructions: "Dry clean or gentle hand wash",
      origin: "Switzerland",
      pattern: "Floral",
      texture: "Soft and delicate",
      opacity: "Semi-transparent",
      stretch: "Slight stretch",
    },
    totalStock: 360,
    trackInventory: true,
    allowBackorder: false,
    featuredImage:
      "https://images.unsplash.com/photo-1558769132-cb1aea28c75b?w=800",
    images: [
      "https://images.unsplash.com/photo-1558769132-cb1aea28c75b?w=800",
      "https://images.unsplash.com/photo-1558769132-6ba4e7e8b836?w=800",
      "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800",
    ],
    metaTitle: "Premium Swiss Lace - Floral Pattern | Fola Store",
    metaDescription:
      "Shop premium Swiss lace with intricate floral patterns. Perfect for bridal and evening wear. Available in multiple colors.",
    metaKeywords: [
      "swiss lace",
      "floral lace",
      "bridal lace",
      "premium fabric",
    ],
    status: "active",
    isPublished: true,
    isFeatured: true,
    averageRating: 4.8,
    reviewCount: 24,
    publishedAt: new Date(),
  },
  {
    name: "Deluxe French Lace - Geometric Design",
    slug: "deluxe-french-lace-geometric-design",
    description:
      "Elegant French lace featuring modern geometric patterns. This luxurious fabric combines traditional craftsmanship with contemporary design. Ideal for fashion-forward garments, cocktail dresses, and statement pieces. The structured pattern provides excellent drape and movement.",
    shortDescription: "Elegant French lace with geometric patterns",
    category: categoryIds["French Lace"],
    tags: ["french", "lace", "geometric", "modern", "luxury"],
    productType: "fabric",
    basePrice: 6500,
    salePrice: 5500,
    currency: "NGN",
    fabricType: "French Lace",
    unitOfMeasure: "yard",
    minimumOrder: 2,
    maximumOrder: 40,
    variants: [
      {
        sku: "FL-GD-WHT-001",
        color: "White",
        colorHex: "#FFFFFF",
        images: [
          "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=600",
        ],
        stock: 85,
        isAvailable: true,
      },
      {
        sku: "FL-GD-CRM-001",
        color: "Cream",
        colorHex: "#FFFDD0",
        images: [
          "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=700",
        ],
        stock: 70,
        isAvailable: true,
      },
      {
        sku: "FL-GD-GLD-001",
        color: "Gold",
        colorHex: "#FFD700",
        images: [
          "https://images.unsplash.com/photo-1558769132-cb1aea28c75b?w=600",
        ],
        stock: 55,
        isAvailable: true,
      },
      {
        sku: "FL-GD-RSE-001",
        color: "Rose",
        colorHex: "#FF007F",
        images: [
          "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600",
        ],
        stock: 45,
        isAvailable: true,
      },
    ],
    specifications: {
      width: "48 inches",
      weight: "Medium",
      composition: "90% Polyester, 10% Elastane",
      careInstructions: "Dry clean recommended",
      origin: "France",
      pattern: "Geometric",
      texture: "Structured and smooth",
      opacity: "Semi-opaque",
      stretch: "Moderate stretch",
    },
    totalStock: 255,
    trackInventory: true,
    allowBackorder: false,
    featuredImage:
      "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=800",
    images: [
      "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=800",
      "https://images.unsplash.com/photo-1558769132-cb1aea28c75b?w=800",
    ],
    metaTitle: "Deluxe French Lace - Geometric Design | Fola Store",
    metaDescription:
      "Luxury French lace with modern geometric patterns. Perfect for contemporary fashion and special occasions.",
    metaKeywords: [
      "french lace",
      "geometric lace",
      "luxury fabric",
      "modern design",
    ],
    status: "active",
    isPublished: true,
    isFeatured: true,
    averageRating: 4.9,
    reviewCount: 18,
    publishedAt: new Date(),
  },
  {
    name: "Classic Guipure Lace - Traditional Motif",
    slug: "classic-guipure-lace-traditional-motif",
    description:
      "Bold and textured Guipure lace featuring traditional motifs. This heavy-bodied lace stands on its own without a backing fabric. Perfect for creating structured garments, jackets, and statement pieces. The raised pattern adds depth and dimension to any design.",
    shortDescription: "Bold Guipure lace with traditional motifs",
    category: categoryIds["Guipure Lace"],
    tags: ["guipure", "lace", "traditional", "bold", "textured"],
    productType: "fabric",
    basePrice: 3800,
    currency: "NGN",
    fabricType: "Guipure",
    unitOfMeasure: "yard",
    minimumOrder: 3,
    maximumOrder: 60,
    variants: [
      {
        sku: "GL-TM-WHT-001",
        color: "White",
        colorHex: "#FFFFFF",
        images: [
          "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600",
        ],
        stock: 150,
        isAvailable: true,
      },
      {
        sku: "GL-TM-NVY-001",
        color: "Navy",
        colorHex: "#000080",
        images: [
          "https://images.unsplash.com/photo-1558769132-6ba4e7e8b836?w=600",
        ],
        stock: 120,
        isAvailable: true,
      },
      {
        sku: "GL-TM-BRG-001",
        color: "Burgundy",
        colorHex: "#800020",
        images: [
          "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=600",
        ],
        stock: 100,
        isAvailable: true,
      },
      {
        sku: "GL-TM-EMR-001",
        color: "Emerald",
        colorHex: "#50C878",
        images: [
          "https://images.unsplash.com/photo-1558769132-cb1aea28c75b?w=600",
        ],
        stock: 80,
        isAvailable: true,
      },
      {
        sku: "GL-TM-BLK-001",
        color: "Black",
        colorHex: "#000000",
        images: [
          "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=700",
        ],
        stock: 95,
        isAvailable: true,
      },
    ],
    specifications: {
      width: "54 inches",
      weight: "Medium to Heavy",
      composition: "100% Polyester",
      careInstructions: "Machine wash cold, gentle cycle",
      origin: "Italy",
      pattern: "Traditional motif",
      texture: "Raised and textured",
      opacity: "Opaque",
      stretch: "No stretch",
    },
    totalStock: 545,
    trackInventory: true,
    allowBackorder: true,
    featuredImage:
      "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800",
    images: [
      "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800",
      "https://images.unsplash.com/photo-1558769132-6ba4e7e8b836?w=800",
    ],
    metaTitle: "Classic Guipure Lace - Traditional Motif | Fola Store",
    metaDescription:
      "Bold Guipure lace with traditional motifs. Perfect for structured garments and statement pieces.",
    metaKeywords: [
      "guipure lace",
      "traditional lace",
      "textured fabric",
      "bold lace",
    ],
    status: "active",
    isPublished: true,
    isFeatured: false,
    averageRating: 4.7,
    reviewCount: 15,
    publishedAt: new Date(),
  },
  {
    name: "Luxury Chantilly Lace - Scalloped Edge",
    slug: "luxury-chantilly-lace-scalloped-edge",
    description:
      "Delicate Chantilly lace with beautiful scalloped edges. This fine, lightweight lace is perfect for veils, overlays, and delicate garment details. The intricate floral pattern and finished edges make it ideal for creating romantic, feminine pieces.",
    shortDescription: "Delicate Chantilly lace with scalloped edges",
    category: categoryIds["Chantilly Lace"],
    tags: ["chantilly", "lace", "scalloped", "delicate", "romantic"],
    productType: "fabric",
    basePrice: 7500,
    currency: "NGN",
    fabricType: "Chantilly",
    unitOfMeasure: "yard",
    minimumOrder: 2,
    maximumOrder: 30,
    variants: [
      {
        sku: "CL-SE-BLK-001",
        color: "Black",
        colorHex: "#000000",
        images: [
          "https://images.unsplash.com/photo-1558769132-6ba4e7e8b836?w=600",
        ],
        stock: 60,
        isAvailable: true,
      },
      {
        sku: "CL-SE-WHT-001",
        color: "White",
        colorHex: "#FFFFFF",
        images: [
          "https://images.unsplash.com/photo-1558769132-cb1aea28c75b?w=600",
        ],
        stock: 55,
        isAvailable: true,
      },
      {
        sku: "CL-SE-RED-001",
        color: "Red",
        colorHex: "#FF0000",
        images: [
          "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=600",
        ],
        stock: 40,
        isAvailable: true,
      },
      {
        sku: "CL-SE-SLV-001",
        color: "Silver",
        colorHex: "#C0C0C0",
        images: [
          "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600",
        ],
        stock: 35,
        isAvailable: true,
      },
    ],
    specifications: {
      width: "50 inches",
      weight: "Light",
      composition: "100% Nylon",
      careInstructions: "Dry clean only",
      origin: "France",
      pattern: "Floral with scalloped edges",
      texture: "Fine and delicate",
      opacity: "Transparent",
      stretch: "No stretch",
    },
    totalStock: 190,
    trackInventory: true,
    allowBackorder: false,
    featuredImage:
      "https://images.unsplash.com/photo-1558769132-6ba4e7e8b836?w=800",
    images: [
      "https://images.unsplash.com/photo-1558769132-6ba4e7e8b836?w=800",
      "https://images.unsplash.com/photo-1558769132-cb1aea28c75b?w=800",
    ],
    metaTitle: "Luxury Chantilly Lace - Scalloped Edge | Fola Store",
    metaDescription:
      "Delicate Chantilly lace with beautiful scalloped edges. Perfect for veils and romantic garments.",
    metaKeywords: [
      "chantilly lace",
      "scalloped lace",
      "delicate fabric",
      "bridal lace",
    ],
    status: "active",
    isPublished: true,
    isFeatured: true,
    averageRating: 5.0,
    reviewCount: 12,
    publishedAt: new Date(),
  },
  {
    name: "Elegant Venetian Lace - Ornate Pattern",
    slug: "elegant-venetian-lace-ornate-pattern",
    description:
      "Ornate Venetian lace with rich, detailed patterns. This luxurious lace features raised designs and intricate needlework. Perfect for creating opulent wedding gowns, evening wear, and high-end fashion pieces. The substantial weight and texture make it ideal for statement garments.",
    shortDescription: "Ornate Venetian lace with rich patterns",
    category: categoryIds["Venetian Lace"],
    tags: ["venetian", "lace", "ornate", "luxury", "wedding"],
    productType: "fabric",
    basePrice: 5200,
    currency: "NGN",
    fabricType: "Venetian",
    unitOfMeasure: "yard",
    minimumOrder: 2,
    maximumOrder: 35,
    variants: [
      {
        sku: "VL-OP-IVY-001",
        color: "Ivory",
        colorHex: "#FFFFF0",
        images: [
          "https://images.unsplash.com/photo-1558769132-cb1aea28c75b?w=600",
        ],
        stock: 95,
        isAvailable: true,
      },
      {
        sku: "VL-OP-CHP-001",
        color: "Champagne",
        colorHex: "#F7E7CE",
        images: [
          "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=600",
        ],
        stock: 75,
        isAvailable: true,
      },
      {
        sku: "VL-OP-GLD-001",
        color: "Gold",
        colorHex: "#FFD700",
        images: [
          "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600",
        ],
        stock: 60,
        isAvailable: true,
      },
    ],
    specifications: {
      width: "46 inches",
      weight: "Medium",
      composition: "95% Polyester, 5% Metallic Thread",
      careInstructions: "Dry clean only",
      origin: "Italy",
      pattern: "Ornate Venetian",
      texture: "Raised and dimensional",
      opacity: "Semi-opaque",
      stretch: "Slight stretch",
    },
    totalStock: 230,
    trackInventory: true,
    allowBackorder: false,
    featuredImage:
      "https://images.unsplash.com/photo-1558769132-cb1aea28c75b?w=800",
    images: [
      "https://images.unsplash.com/photo-1558769132-cb1aea28c75b?w=800",
      "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=800",
    ],
    metaTitle: "Elegant Venetian Lace - Ornate Pattern | Fola Store",
    metaDescription:
      "Luxurious Venetian lace with rich, ornate patterns. Perfect for wedding gowns and high-end fashion.",
    metaKeywords: [
      "venetian lace",
      "ornate lace",
      "wedding lace",
      "luxury fabric",
    ],
    status: "active",
    isPublished: true,
    isFeatured: false,
    averageRating: 4.6,
    reviewCount: 8,
    publishedAt: new Date(),
  },
  {
    name: "Royal Swiss Embroidered Lace",
    slug: "royal-swiss-embroidered-lace",
    description:
      "Premium Swiss lace with exquisite embroidery. This high-end fabric combines traditional Swiss lace-making with modern embroidery techniques. Features metallic thread accents and three-dimensional floral motifs. Ideal for couture designs, red carpet gowns, and luxury bridal wear.",
    shortDescription: "Premium Swiss lace with embroidery",
    category: categoryIds["Swiss Lace"],
    tags: ["swiss", "embroidered", "premium", "royal", "couture"],
    productType: "fabric",
    basePrice: 5800,
    currency: "NGN",
    fabricType: "Swiss Lace",
    unitOfMeasure: "yard",
    minimumOrder: 2,
    maximumOrder: 25,
    variants: [
      {
        sku: "RSL-EM-WHT-001",
        color: "White",
        colorHex: "#FFFFFF",
        images: [
          "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=600",
        ],
        stock: 110,
        isAvailable: true,
      },
      {
        sku: "RSL-EM-IVY-001",
        color: "Ivory",
        colorHex: "#FFFFF0",
        images: [
          "https://images.unsplash.com/photo-1558769132-cb1aea28c75b?w=600",
        ],
        stock: 90,
        isAvailable: true,
      },
      {
        sku: "RSL-EM-PNK-001",
        color: "Pink",
        colorHex: "#FFC0CB",
        images: [
          "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600",
        ],
        stock: 70,
        isAvailable: true,
      },
      {
        sku: "RSL-EM-BLU-001",
        color: "Blue",
        colorHex: "#0000FF",
        images: [
          "https://images.unsplash.com/photo-1558769132-6ba4e7e8b836?w=600",
        ],
        stock: 55,
        isAvailable: true,
      },
    ],
    specifications: {
      width: "52 inches",
      weight: "Light to Medium",
      composition: "85% Polyester, 10% Nylon, 5% Metallic Thread",
      careInstructions: "Dry clean only",
      origin: "Switzerland",
      pattern: "3D Floral Embroidery",
      texture: "Textured with raised embroidery",
      opacity: "Semi-transparent",
      stretch: "Slight stretch",
    },
    totalStock: 325,
    trackInventory: true,
    allowBackorder: false,
    featuredImage:
      "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=800",
    images: [
      "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=800",
      "https://images.unsplash.com/photo-1558769132-cb1aea28c75b?w=800",
    ],
    metaTitle: "Royal Swiss Embroidered Lace | Fola Store",
    metaDescription:
      "Premium Swiss lace with exquisite embroidery. Perfect for couture and luxury bridal designs.",
    metaKeywords: [
      "swiss lace",
      "embroidered lace",
      "premium fabric",
      "couture",
    ],
    status: "active",
    isPublished: true,
    isFeatured: true,
    averageRating: 4.8,
    reviewCount: 21,
    publishedAt: new Date(),
  },
];

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seed...\n");

    // Connect to database
    await connectDB();

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      Review.deleteMany({}),
    ]);
    console.log("✅ Existing data cleared\n");

    // Create users
    console.log("👥 Creating users...");
    const createdUsers = await User.create(users);
    console.log(`✅ Created ${createdUsers.length} users\n`);

    // Create categories
    console.log("📂 Creating categories...");
    const createdCategories = await Category.create(categories);

    // Update parent relationships
    const parentCategory = createdCategories.find(
      (cat) => cat.slug === "lace-materials"
    );
    const childCategories = createdCategories.filter((cat) => cat.level === 1);

    for (const child of childCategories) {
      child.parent = parentCategory!._id as any;
      await child.save();
    }
    console.log(`✅ Created ${createdCategories.length} categories\n`);

    // Create category ID map
    const categoryIds: any = {};
    createdCategories.forEach((cat) => {
      categoryIds[cat.name] = cat._id;
    });

    // Create products
    console.log("📦 Creating products...");
    const productsData = getProducts(categoryIds);
    for (const product of productsData) {
      const mainImages = await getUnsplashImages(
        `${product.fabricType} lace fabric`,
        3
      );

      if (mainImages.length > 0) {
        product.featuredImage = mainImages[0];
        product.images = mainImages; // Or fetch multiple times for more
      }

      for (const variant of product.variants) {
        const colorQuery = `${variant.color} ${product.fabricType} lace fabric`;
        const vimgs = await getUnsplashImages(colorQuery);

        if (vimgs.length > 0) {
          variant.images = vimgs;
        } else {
          variant.images = [product.featuredImage];
        }
      }
    }
    const createdProducts = await Product.create(productsData);
    console.log(`✅ Created ${createdProducts.length} products\n`);

    // Create sample reviews
    console.log("⭐ Creating reviews...");
    const customer = createdUsers.find((u) => (u.role as any) === "customer");
    const reviewsData = createdProducts.slice(0, 4).map((product, index) => ({
      product: product._id,
      customer: customer!._id,
      rating: [5, 4, 5, 5][index],
      title: [
        "Absolutely stunning!",
        "Beautiful quality",
        "Perfect for my wedding dress",
        "Exceeded expectations",
      ][index],
      comment: [
        "This lace is absolutely beautiful. The quality is outstanding and it worked perfectly for my bridal gown. Highly recommend!",
        "Very happy with this purchase. The fabric is exactly as described and the colors are gorgeous.",
        "I used this for my wedding dress and it was perfect. The delicate pattern is stunning and it was easy to work with.",
        "The quality of this lace exceeded my expectations. Beautiful craftsmanship and fast delivery.",
      ][index],
      isVerifiedPurchase: true,
      isPublished: true,
      helpfulCount: [15, 8, 12, 6][index],
    }));

    await Review.create(reviewsData);
    console.log(`✅ Created ${reviewsData.length} reviews\n`);

    // Update product ratings
    for (const product of createdProducts) {
      const reviews = await Review.find({
        product: product._id,
        isPublished: true,
      });
      if (reviews.length > 0) {
        const avgRating =
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length;
        product.averageRating = Math.round(avgRating * 10) / 10;
        product.reviewCount = reviews.length;
        await product.save();
      }
    }

    // Create sample order
    console.log("🛒 Creating sample order...");
    const sampleProduct = createdProducts[0];
    const sampleVariant = sampleProduct.variants[0];

    await Order.create({
      orderNumber: 1,
      customer: customer!._id,
      items: [
        {
          product: sampleProduct._id,
          productName: sampleProduct.name,
          productImage: sampleProduct.featuredImage,
          variant: {
            sku: sampleVariant.sku,
            color: sampleVariant.color,
            colorHex: sampleVariant.colorHex,
          },
          quantity: 5,
          unitPrice: sampleProduct.basePrice,
          totalPrice: sampleProduct.basePrice * 5,
          unitOfMeasure: sampleProduct.unitOfMeasure,
        },
      ],
      subtotal: sampleProduct.basePrice * 5,
      shippingCost: 1500,
      total: sampleProduct.basePrice * 5 + 1500,
      currency: "NGN",
      shippingAddress: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "+234 800 000 0002",
        address: "123 Lekki Phase 1",
        city: "Lagos",
        state: "Lagos",
        postalCode: "100001",
        country: "Nigeria",
      },
      billingAddress: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "+234 800 000 0002",
        address: "123 Lekki Phase 1",
        city: "Lagos",
        state: "Lagos",
        postalCode: "100001",
        country: "Nigeria",
      },
      payment: {
        method: "paystack",
        reference: `REF-${Date.now()}`,
        status: "completed",
        amount: sampleProduct.basePrice * 5 + 1500,
        currency: "NGN",
        paidAt: new Date(),
      },
      status: "delivered",
      fulfillmentStatus: "fulfilled",
      deliveredAt: new Date(),
    });
    console.log("✅ Created sample order\n");

    // Summary
    console.log("═══════════════════════════════════════");
    console.log("✅ DATABASE SEEDING COMPLETED!");
    console.log("═══════════════════════════════════════");
    console.log("\n📊 Summary:");
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Categories: ${createdCategories.length}`);
    console.log(`   Products: ${createdProducts.length}`);
    console.log(`   Reviews: ${reviewsData.length}`);
    console.log(`   Orders: 1`);
    console.log("\n👤 Test Accounts:");
    console.log("   Admin:");
    console.log("     Email: admin@luxelace.com");
    console.log("     Password: Admin123!");
    console.log("   Customer:");
    console.log("     Email: john@example.com");
    console.log("     Password: Customer123!");
    console.log("   Staff:");
    console.log("     Email: staff@luxelace.com");
    console.log("     Password: Staff123!");
    console.log("═══════════════════════════════════════\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
};

// Run seed
seedDatabase();
