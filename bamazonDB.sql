DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;


CREATE TABLE items (
  id INTEGER(11) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  product_department VARCHAR(100),
  price INTEGER(11),
  stock INTEGER(11),
  PRIMARY KEY (id)
);

SELECT * FROM items;