// CREATE TABLE Complaints (
//     complaint_id INT PRIMARY KEY AUTO_INCREMENT,
//     user_id INT NOT NULL,      -- The user who lodged the complaint
//     site_id INT,               -- The site affected (if applicable)
//     product_id INT,            -- The product related to the complaint (if applicable)
//     complaint_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     complaint_text TEXT,
//     status VARCHAR(50),        -- e.g., Pending, In Progress, Resolved
//     resolution TEXT,
//     resolved_at TIMESTAMP NULL,
//     FOREIGN KEY (user_id) REFERENCES Users(user_id),
//     FOREIGN KEY (site_id) REFERENCES Sites(site_id),
//     FOREIGN KEY (product_id) REFERENCES Products(product_id)
//   );
import pool  from "../db/dataConnection";
import { QueryResult } from "pg";

interface Complaint {
  userId: number;
  siteId?: number;
  productId?: number;
  complaintText: string;
}

// Create a new complaint
export const createComplaint = async (complaint: Complaint): Promise<Complaint> => {
  const {
    userId,
    siteId,
    productId,
    complaintText,
  } = complaint;
  const createComplaintQuery = `
    INSERT INTO complaints (user_id, site_id, product_id, complaint_text)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  try {
    const { rows }: QueryResult = await pool.query(createComplaintQuery, [
      userId,
      siteId,
      productId,
      complaintText,
    ]);
    return rows[0];
  } catch (error) {
    console.error('Error creating complaint:', error);
    throw error;
  }
};

// Get all complaints
export const getComplaints = async (): Promise<Complaint[]> => {
  const getComplaintsQuery = `
    SELECT * FROM complaints;
  `;

  try {
    const { rows }: QueryResult = await pool.query(getComplaintsQuery);
    return rows;
  } catch (error) {
    console.error('Error getting complaints:', error);
    throw error;
  }
};

// Get a complaint by id
export const getComplaintById = async (id: number): Promise<Complaint | null> => {
  const getComplaintByIdQuery = `
    SELECT * FROM complaints
    WHERE complaint_id = $1;
  `;

  try {
    const { rows }: QueryResult = await pool.query(getComplaintByIdQuery, [id]);
    return rows[0] || null;
  } catch (error) {
    console.error('Error getting complaint by id:', error);
    throw error;
  }
};

// Get all complaints by user
export const getComplaintsByUser = async (userId: number): Promise<Complaint[]> => {
  const getComplaintsByUserQuery = `
    SELECT * FROM complaints
    WHERE user_id = $1;
  `;

  try {
    const { rows }: QueryResult = await pool.query(getComplaintsByUserQuery, [userId]);
    return rows;
  } catch (error) {
    console.error('Error getting complaints by user:', error);
    throw error;
  }
};

// Update a complaint
export const updateComplaint = async (
  id: number,
  complaint: Partial<Complaint>
): Promise<Complaint> => {
  const {
    userId,
    siteId,
    productId,
    complaintText,
  } = complaint;
  const updateComplaintQuery = `
    UPDATE complaints
    SET user_id = $1,
        site_id = $2,
        product_id = $3,
        complaint_text = $4
    WHERE complaint_id = $5
    RETURNING *;
  `;

  try {
    const { rows }: QueryResult = await pool.query(updateComplaintQuery, [
      userId,
      siteId,
      productId,
      complaintText,
      id,
    ]);
    return rows[0];
  } catch (error) {
    console.error('Error updating complaint:', error);
    throw error;
  }
};

// Delete a complaint
export const deleteComplaint = async (id: number): Promise<string> => {
  const deleteComplaintQuery = `
    DELETE FROM complaints
    WHERE complaint_id = $1
    RETURNING 'Complaint deleted';
  `;

  try {
    const { rows }: QueryResult = await pool.query(deleteComplaintQuery, [id]);
    return rows[0].returning;
  } catch (error) {
    console.error('Error deleting complaint:', error);
    throw error;
  }
};

// Resolve a complaint
export const resolveComplaint = async (
  id: number,
  resolution: string
): Promise<Complaint> => {
  const resolveComplaintQuery = `
    UPDATE complaints
    SET status = 'Resolved',
        resolution = $1,
        resolved_at = CURRENT_TIMESTAMP
    WHERE complaint_id = $2
    RETURNING *;
  `;

  try {
    const { rows }: QueryResult = await pool.query(resolveComplaintQuery, [resolution, id]);
    return rows[0];
  } catch (error) {
    console.error('Error resolving complaint:', error);
    throw error;
  }
};

// Get all unresolved complaints
export const getUnresolvedComplaints = async (): Promise<Complaint[]> => {
  const getUnresolvedComplaintsQuery = `
    SELECT * FROM complaints
    WHERE status != 'Resolved';
  `;

  try {
    const { rows }: QueryResult = await pool.query(getUnresolvedComplaintsQuery);
    return rows;
  } catch (error) {
    console.error('Error getting unresolved complaints:', error);
    throw error;
  }
};

// Get all complaints by site
export const getComplaintsBySite = async (siteId: number): Promise<Complaint[]> => {
  const getComplaintsBySiteQuery = `
    SELECT * FROM complaints
    WHERE site_id = $1;
  `;

  try {
    const { rows }: QueryResult = await pool.query(getComplaintsBySiteQuery, [siteId]);
    return rows;
  } catch (error) {
    console.error('Error getting complaints by site:', error);
    throw error;
  }
};

// Get all complaints by product
export const getComplaintsByProduct = async (productId: number): Promise<Complaint[]> => {
  const getComplaintsByProductQuery = `
    SELECT * FROM complaints
    WHERE product_id = $1;
  `;

  try {
    const { rows }: QueryResult = await pool.query(getComplaintsByProductQuery, [productId]);
    return rows;
  } catch (error) {
    console.error('Error getting complaints by product:', error);
    throw error;
  }
};

// Get all complaints by status
export const getComplaintsByStatus = async (status: string): Promise<Complaint[]> => {
  const getComplaintsByStatusQuery = `
    SELECT * FROM complaints
    WHERE status = $1;
  `;

  try {
    const { rows }: QueryResult = await pool.query(getComplaintsByStatusQuery, [status]);
    return rows;
  } catch (error) {
    console.error('Error getting complaints by status:', error);
    throw error;
  }
};

// Get all complaints by resolution
export const getComplaintsByResolution = async (resolution: string): Promise<Complaint[]> => {
  const getComplaintsByResolutionQuery = `
    SELECT * FROM complaints
    WHERE resolution = $1;
  `;

  try {
    const { rows }: QueryResult = await pool.query(getComplaintsByResolutionQuery, [resolution]);
    return rows;
  } catch (error) {
    console.error('Error getting complaints by resolution:', error);
    throw error;
  }
};