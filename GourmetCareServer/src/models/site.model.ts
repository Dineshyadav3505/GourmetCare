import { QueryResult } from "pg";
import pool from "../db/dataConnection";

interface Site {
  id?: number;
  siteName: string;
  address: string;
  contactPerson: string;
  contactPhone: string;
}

// Create sites table if it doesn't exist
export const createSitesTable = async (): Promise<void> => {
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        site_name VARCHAR(100) NOT NULL,
        address TEXT,
        contact_person VARCHAR(100),
        contact_phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

  try {
    await pool.query(createTableQuery);
    console.log("Sites table created successfully");
  } catch (error) {
    console.error("Error creating Sites table:", error);
    throw error;
  }
};

// Create a new site
export const createSite = async (site: Site): Promise<Site> => {
  const { siteName, address, contactPerson, contactPhone } = site;
  const createSiteQuery = `
      INSERT INTO sites (site_name, address, contact_person, contact_phone)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

  try {
    const { rows }: QueryResult = await pool.query(createSiteQuery, [
      siteName,
      address,
      contactPerson,
      contactPhone,
    ]);
    return rows[0];
  } catch (error) {
    console.error("Error creating site:", error);
    throw error;
  }
};

// Get all sites
export const getSites = async (): Promise<Site[]> => {
  const getSitesQuery = `
      SELECT * FROM sites;
    `;

  try {
    const { rows }: QueryResult = await pool.query(getSitesQuery);
    return rows;
  } catch (error) {
    console.error("Error getting sites:", error);
    throw error;
  }
};

// Get a site by id
export const getSiteById = async (id: number): Promise<Site | null> => {
  const getSiteByIdQuery = `
        SELECT * FROM sites
        WHERE id = $1;
        `;

  try {
    const { rows }: QueryResult = await pool.query(getSiteByIdQuery, [id]);
    return rows[0] || null;
  } catch (error) {
    console.error("Error getting site by id:", error);
    throw error;
  }
};

// Update a site
export const updateSite = async (
  id: number,
  updatedSiteData: Partial<Site>
): Promise<Site | null> => {
  const { siteName, address, contactPerson, contactPhone } = updatedSiteData;
  const updateSiteQuery = `
        UPDATE sites
        SET site_name = $1, address = $2, contact_person = $3, contact_phone = $4
        WHERE id = $5
        RETURNING *;
        `;

  try {
    const { rows }: QueryResult = await pool.query(updateSiteQuery, [
      siteName,
      address,
      contactPerson,
      contactPhone,
      id,
    ]);
    return rows[0] || null;
  } catch (error) {
    console.error("Error updating site:", error);
    throw error;
  }
};

// Delete a site
export const deleteSite = async (id: number): Promise<string> => {
  const deleteSiteQuery = `
        DELETE FROM sites
        WHERE id = $1;
        `;

  try {
    await pool.query(deleteSiteQuery, [id]);
    return "Site deleted successfully";
  } catch (error) {
    console.error("Error deleting site:", error);
    throw error;
  }
};


