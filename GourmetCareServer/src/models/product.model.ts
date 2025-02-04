import { QueryResult } from "pg";
import pool from "../db/dataConnection";

interface Product {
  productId?: number;
  productName: string;
  description: string;
  model: string;
  manufacturer: string;
  purchaseDate: Date;
  warrantyExpiry: Date;
}

// Create products table if it doesn't exist
export const createProductsTable = async (): Promise<void> => {
  const createTableQuery = `
        CREATE TABLE IF NOT EXISTS products (
        product_id SERIAL PRIMARY KEY,
        product_name VARCHAR(100) NOT NULL,
        description TEXT,
        model VARCHAR(50),
        manufacturer VARCHAR(50),
        purchase_date DATE,
        warranty_expiry DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

  try {
    await pool.query(createTableQuery);
    console.log("Products table created successfully");
  } catch (error) {
    console.error("Error creating Products table:", error);
    throw error;
  }
};

// Create a new product
export const createProduct = async (product: Product): Promise<Product> => {
  const {
    productName,
    description,
    model,
    manufacturer,
    purchaseDate,
    warrantyExpiry,
  } = product;
  const createProductQuery = `
            INSERT INTO products (product_name, description, model, manufacturer, purchase_date, warranty_expiry)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;

  try {
    const { rows }: QueryResult = await pool.query(createProductQuery, [
      productName,
      description,
      model,
      manufacturer,
      purchaseDate,
      warrantyExpiry,
    ]);
    return rows[0];
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  const getProductsQuery = `
            SELECT * FROM products;
        `;

  try {
    const { rows }: QueryResult = await pool.query(getProductsQuery);
    return rows;
  } catch (error) {
    console.error("Error getting products:", error);
    throw error;
  }
};

// Get a product by id
export const getProductById = async (id: number): Promise<Product | null> => {
  const getProductByIdQuery = `
            SELECT * FROM products
            WHERE product_id = $1;
        `;

  try {
    const { rows }: QueryResult = await pool.query(getProductByIdQuery, [id]);
    return rows[0] || null;
  } catch (error) {
    console.error("Error getting product by id:", error);
    throw error;
  }
};

// Update a product
export const updateProduct = async (
  id: number,
  product: Product
): Promise<Product> => {
  const {
    productName,
    description,
    model,
    manufacturer,
    purchaseDate,
    warrantyExpiry,
  } = product;
  const updateProductQuery = `
            UPDATE products
            SET product_name = $1,
                description = $2,
                model = $3,
                manufacturer = $4,
                purchase_date = $5,
                warranty_expiry = $6
            WHERE product_id = $7
            RETURNING *;
        `;

  try {
    const { rows }: QueryResult = await pool.query(updateProductQuery, [
      productName,
      description,
      model,
      manufacturer,
      purchaseDate,
      warrantyExpiry,
      id,
    ]);
    return rows[0];
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (id: number): Promise<void> => {
  const deleteProductQuery = `
            DELETE FROM products
            WHERE product_id = $1;
        `;

  try {
    await pool.query(deleteProductQuery, [id]);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};