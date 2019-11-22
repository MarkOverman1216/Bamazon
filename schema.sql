DROP DATABASE IF EXISTS bamazonDB;
CREATE database bamazonDB;

USE bamazonDB;

CREATE TABLE products (

  item_id INT NOT NULL auto_increment,
  product_name VARCHAR(30) NULL,
  department_name VARCHAR(30) NULL,
  price DECIMAL(11,2) NULL,
  stock_quantity INT NULL,
  product_sales DECIMAL(11,2) NULL,

  PRIMARY KEY (item_id)
);

INSERT INTO products ( product_name, department_name, price, stock_quantity)
VALUES ('Beds', 'Furniture', 12.70, 20);
INSERT INTO products ( product_name, department_name, price, stock_quantity)
VALUES ('TVs', 'Electronics', 14.50, 20);
INSERT INTO products ( product_name, department_name, price, stock_quantity)
VALUES ('xBox', 'Electronics', 87, 20);
INSERT INTO products ( product_name, department_name, price, stock_quantity)
VALUES ('iPhone', 'Electronics', 1199.99, 20);
INSERT INTO products ( product_name, department_name, price, stock_quantity)
VALUES ('Play Station', 'Electronics', 9500.00, 20);
INSERT INTO products ( product_name, department_name, price, stock_quantity)
VALUES ('Couch', 'Furniture', 12.70, 20);
INSERT INTO products ( product_name, department_name, price, stock_quantity)
VALUES ('Table', 'Furniture', 14.50, 20);
INSERT INTO products ( product_name, department_name, price, stock_quantity)
VALUES ('Eggs', 'Food', 87, 20);
INSERT INTO products ( product_name, department_name, price, stock_quantity)
VALUES ('Steak', 'Food', 1199.99, 20);
INSERT INTO products ( product_name, department_name, price, stock_quantity)
VALUES ('Potatoes', 'Food', 9500.00, 20);


-- ------------------------------------------

CREATE TABLE departments (

  department_id INT NOT NULL auto_increment,
  department_name VARCHAR(30) NULL,
  over_head_costs DECIMAL(11,2) NULL,

  PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name,over_head_costs)
VALUES ('Electronics', 200);
INSERT INTO departments (department_name,over_head_costs)
VALUES ('Furniture', 150);
INSERT INTO departments (department_name,over_head_costs)
VALUES ('Food', 20);
