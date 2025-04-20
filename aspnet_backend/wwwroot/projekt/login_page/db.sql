CREATE DATABASE IF NOT EXISTS clothing_store;
USE clothing_store;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);



INSERT INTO users (email, password) VALUES ('user@example.com', '123456');
