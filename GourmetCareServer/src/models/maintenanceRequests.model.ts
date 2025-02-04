import pool from "../db/dataConnection";
import { QueryResult } from "pg";

interface MaintenanceRequest {
  maintenanceRequestId?: number;
  productId: number;
  siteId: number;
  assignedTo: number;
  maintenanceDate: Date;
  status: string;
  remarks: string;
}

// Create maintenance_requests table if it doesn't exist
export const createMaintenanceRequestsTable = async (): Promise<void> => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS maintenance_requests (
      maintenance_request_id SERIAL PRIMARY KEY,
      product_id INT NOT NULL,
      site_id INT,
      assigned_to INT,
      maintenance_date DATE,
      status VARCHAR(50),
      remarks TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log("Maintenance requests table created successfully");
  } catch (error) {
    console.error("Error creating Maintenance requests table:", error);
    throw error;
  }
};

// Create a new maintenance request
export const createMaintenanceRequest = async (
  maintenanceRequest: MaintenanceRequest
): Promise<MaintenanceRequest> => {
  const {
    productId,
    siteId,
    assignedTo,
    maintenanceDate,
    status,
    remarks,
  } = maintenanceRequest;
  const createMaintenanceRequestQuery = `
    INSERT INTO maintenance_requests (product_id, site_id, assigned_to, maintenance_date, status, remarks)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  try {
    const { rows }: QueryResult = await pool.query(createMaintenanceRequestQuery, [
      productId,
      siteId,
      assignedTo,
      maintenanceDate,
      status,
      remarks,
    ]);
    return rows[0];
  } catch (error) {
    console.error("Error creating maintenance request:", error);
    throw error;
  }
};

// Get all maintenance requests
export const getMaintenanceRequests = async (): Promise<MaintenanceRequest[]> => {
  const getMaintenanceRequestsQuery = `
    SELECT * FROM maintenance_requests;
  `;

  try {
    const { rows }: QueryResult = await pool.query(getMaintenanceRequestsQuery);
    return rows;
  } catch (error) {
    console.error("Error getting maintenance requests:", error);
    throw error;
  }
};

// Get a maintenance request by id
export const getMaintenanceRequestById = async (
  id: number
): Promise<MaintenanceRequest | null> => {
  const getMaintenanceRequestByIdQuery = `
    SELECT * FROM maintenance_requests
    WHERE maintenance_request_id = $1;
  `;

  try {
    const { rows }: QueryResult = await pool.query(getMaintenanceRequestByIdQuery, [id]);
    return rows[0] || null;
  } catch (error) {
    console.error("Error getting maintenance request by id:", error);
    throw error;
  }
};

// Update a maintenance request
export const updateMaintenanceRequest = async (
  maintenanceRequestId: number,
  updatedMaintenanceRequestData: Partial<MaintenanceRequest>
): Promise<MaintenanceRequest | null> => {
  const {
    productId,
    siteId,
    assignedTo,
    maintenanceDate,
    status,
    remarks,
  } = updatedMaintenanceRequestData;
  const updateMaintenanceRequestQuery = `
    UPDATE maintenance_requests
    SET product_id = $1, site_id = $2, assigned_to = $3, maintenance_date = $4, status = $5, remarks = $6, updated_at = CURRENT_TIMESTAMP
    WHERE maintenance_request_id = $7
    RETURNING *;
  `;

  try {
    const { rows }: QueryResult = await pool.query(updateMaintenanceRequestQuery, [
      productId,
      siteId,
      assignedTo,
      maintenanceDate,
      status,
      remarks,
      maintenanceRequestId,
    ]);
    return rows[0] || null;
  } catch (error) {
    console.error("Error updating maintenance request:", error);
    throw error;
  }
};

// Delete a maintenance request
export const deleteMaintenanceRequest = async (
  maintenanceRequestId: number
): Promise<string> => {
  const deleteMaintenanceRequestQuery = `
    DELETE FROM maintenance_requests
    WHERE maintenance_request_id = $1
    RETURNING 'Maintenance request deleted successfully';
  `;

  try {
    const { rows }: QueryResult = await pool.query(deleteMaintenanceRequestQuery, [maintenanceRequestId]);
    return rows[0];
  } catch (error) {
    console.error("Error deleting maintenance request:", error);
    throw error;
  }
};

// Get maintenance requests by product id
export const getMaintenanceRequestsByProductId = async (
  productId: number
): Promise<MaintenanceRequest[]> => {
  const getMaintenanceRequestsByProductIdQuery = `
    SELECT * FROM maintenance_requests
    WHERE product_id = $1;
  `;

  try {
    const { rows }: QueryResult = await pool.query(getMaintenanceRequestsByProductIdQuery, [productId]);
    return rows;
  } catch (error) {
    console.error("Error getting maintenance requests by product id:", error);
    throw error;
  }
};

// Get maintenance requests by site id
export const getMaintenanceRequestsBySiteId = async (
  siteId: number
): Promise<MaintenanceRequest[]> => {
  const getMaintenanceRequestsBySiteIdQuery = `
    SELECT * FROM maintenance_requests
    WHERE site_id = $1;
  `;

  try {
    const { rows }: QueryResult = await pool.query(getMaintenanceRequestsBySiteIdQuery, [siteId]);
    return rows;
  } catch (error) {
    console.error("Error getting maintenance requests by site id:", error);
    throw error;
  }
};

// Get maintenance requests by assigned user id
export const getMaintenanceRequestsByAssignedUser = async (
  assignedTo: number
): Promise<MaintenanceRequest[]> => {
  const getMaintenanceRequestsByAssignedUserQuery = `
    SELECT * FROM maintenance_requests
    WHERE assigned_to = $1;
  `;

  try {
    const { rows }: QueryResult = await pool.query(getMaintenanceRequestsByAssignedUserQuery, [assignedTo]);
    return rows;
  } catch (error) {
    console.error("Error getting maintenance requests by assigned user id:", error);
    throw error;
  }
};

// Get maintenance requests by status
export const getMaintenanceRequestsByStatus = async (
  status: string
): Promise<MaintenanceRequest[]> => {
  const getMaintenanceRequestsByStatusQuery = `
    SELECT * FROM maintenance_requests
    WHERE status = $1;
  `;

  try {
    const { rows }: QueryResult = await pool.query(getMaintenanceRequestsByStatusQuery, [status]);
    return rows;
  } catch (error) {
    console.error("Error getting maintenance requests by status:", error);
    throw error;
  }
};

// Get maintenance requests by date
export const getMaintenanceRequestsByDate = async (
  maintenanceDate: Date
): Promise<MaintenanceRequest[]> => {
  const getMaintenanceRequestsByDateQuery = `
    SELECT * FROM maintenance_requests
    WHERE maintenance_date = $1;
  `;

  try {
    const { rows }: QueryResult = await pool.query(getMaintenanceRequestsByDateQuery, [maintenanceDate]);
    return rows;
  } catch (error) {
    console.error("Error getting maintenance requests by date:", error);
    throw error;
  }
};

// Get maintenance requests by product id and status
export const getMaintenanceRequestsByProductIdAndStatus = async (
  productId: number,
  status: string
): Promise<MaintenanceRequest[]> => {
  const getMaintenanceRequestsByProductIdAndStatusQuery = `
    SELECT * FROM maintenance_requests
    WHERE product_id = $1 AND status = $2;
  `;

  try {
    const { rows }: QueryResult = await pool.query(getMaintenanceRequestsByProductIdAndStatusQuery, [productId, status]);
    return rows;
  } catch (error) {
    console.error("Error getting maintenance requests by product id and status:", error);
    throw error;
  }
};

// Get maintenance requests by site id and status
export const getMaintenanceRequestsBySiteIdAndStatus = async (
  siteId: number,
  status: string
): Promise<MaintenanceRequest[]> => {
  const getMaintenanceRequestsBySiteIdAndStatusQuery = `
    SELECT * FROM maintenance_requests
    WHERE site_id = $1 AND status = $2;
  `;

  try {
    const { rows }: QueryResult = await pool.query(getMaintenanceRequestsBySiteIdAndStatusQuery, [siteId, status]);
    return rows;
  } catch (error) {
    console.error("Error getting maintenance requests by site id and status:", error);
    throw error;
  }
};

// Get maintenance requests by assigned user id and status
export const getMaintenanceRequestsByAssignedUserAndStatus = async (
  assignedTo: number,
  status: string
): Promise<MaintenanceRequest[]> => {
  const getMaintenanceRequestsByAssignedUserAndStatusQuery = `
    SELECT * FROM maintenance_requests
    WHERE assigned_to = $1 AND status = $2;
  `;

  try {
    const { rows }: QueryResult = await pool.query(getMaintenanceRequestsByAssignedUserAndStatusQuery, [assignedTo, status]);
    return rows;
  } catch (error) {
    console.error("Error getting maintenance requests by assigned user id and status:", error);
    throw error;
  }
};

// Get maintenance requests by date and status
export const getMaintenanceRequestsByDateAndStatus = async (
  maintenanceDate: Date,
  status: string
): Promise<MaintenanceRequest[]> => {
  const getMaintenanceRequestsByDateAndStatusQuery = `
    SELECT * FROM maintenance_requests
    WHERE maintenance_date = $1 AND status = $2;
  `;

  try {
    const { rows }: QueryResult = await pool.query(getMaintenanceRequestsByDateAndStatusQuery, [maintenanceDate, status]);
    return rows;
  } catch (error) {
    console.error("Error getting maintenance requests by date and status:", error);
    throw error;
  }
};

// Get maintenance requests by product id, site id, and status
export const getMaintenanceRequestsByProductIdSiteIdAndStatus = async (
  productId: number,
  siteId: number,
  status: string
): Promise<MaintenanceRequest[]> => {
  const getMaintenanceRequestsByProductIdSiteIdAndStatusQuery = `
    SELECT * FROM maintenance_requests
    WHERE product_id = $1 AND site_id = $2 AND status = $3;
  `;

  try {
    const { rows }: QueryResult = await pool.query(getMaintenanceRequestsByProductIdSiteIdAndStatusQuery, [productId, siteId, status]);
    return rows;
  } catch (error) {
    console.error("Error getting maintenance requests by product id, site id, and status:", error);
    throw error;
  }
};
