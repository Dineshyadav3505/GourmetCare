// CREATE TABLE Product_History (
//     history_id INT PRIMARY KEY AUTO_INCREMENT,
//     product_id INT NOT NULL,
//     site_id INT,               -- Site where the product is deployed/maintained
//     assigned_to INT,           -- User responsible (foreign key from Users)
//     maintenance_date DATE,
//     status VARCHAR(50),
//     remarks TEXT,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//     FOREIGN KEY (product_id) REFERENCES Products(product_id),
//     FOREIGN KEY (site_id) REFERENCES Sites(site_id),
//     FOREIGN KEY (assigned_to) REFERENCES Users(user_id)
//   );
  