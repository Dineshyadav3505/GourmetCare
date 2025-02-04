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
  