import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Получить общее количество всех товаров на всех складах
export async function countAllProducts(): Promise<number> {
  const productCount = await prisma.product.count();
  return productCount;
}

// Получить товары на определенном складе
export async function getProductsOnStock(uuid: string): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: {
      product_warehouses: {
        some: {
          warehouse_uuid: uuid,
        },
      },
    },
    include: {
      product_warehouses: {
        select: { quantity: true },
      },
    },
  });
  return products;
}

// Получить количество товара
export async function countProduct(sku: string): Promise<number> {
  const productCount = await prisma.product.findUnique({
    where: { sku },
    include: {
      product_warehouses: {
        _count: true,
      },
    },
  });
  return productCount?.product_warehouses?._count ?? 0;
}

// Получить количество товара на определенном складе
export async function countProductOnStock(
  uuid: string,
  sku: string
): Promise<number> {
  const productQuantity = await prisma.product_warehouse.findUnique({
    where: {
      product_sku: sku,
      warehouse_uuid: uuid,
    },
    select: { quantity: true },
  });
  return productQuantity?.quantity ?? 0;
}

// Получить количество продуктов по категории
export async function countProductByCategory(slug: string): Promise<number> {
  const productCount = await prisma.product.count({
    where: {
      product_categories: {
        some: {
          category_slug: slug,
        },
      },
    },
  });
  return productCount;
}

// Получить количество продуктов на определенном складе по категории
export async function countProductOnStockByCategory(
  uuid: string,
  slug: string
): Promise<number> {
  const productCount = await prisma.product.count({
    where: {
      product_warehouses: {
        some: {
          warehouse_uuid: uuid,
        },
      },
      product_categories: {
        some: {
          category_slug: slug,
        },
      },
    },
  });
  return productCount;
}
