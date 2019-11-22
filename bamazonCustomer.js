var mysql = require("mysql");
var inquirer = require("inquirer");
var dataSet
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "NaG7nyJ8$bU&&j4q",
  database: "bamazonDB"
});

connection.connect(function (err) {
  if (err) throw err;
  displayDB();
});


function displayDB() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    dataSet = res;
    res.forEach(row => {
      console.log(row.item_id, row.product_name, row.department_name, row.price, row.stock_quantity)
    });
    promptOptions()
  });
}

function promptOptions() {
  dataIDs = []
  dataSet.forEach(row => dataIDs.push(row.item_id))
  dataIDs.push('Exit')
  inquirer.prompt([
    {
      message: 'What is the ID of the product you wish to buy?',
      type: 'list',
      choices: dataIDs,
      name: 'idToBuy'
    }
  ]).then(selectSingle(productIdResponse))
}


function selectSingle(productIdResponse) {
  if (productIdResponse.idToBuy === 'Exit') {
    connection.end()
  } else {

    connection.query("SELECT * FROM products WHERE ?", { item_id: productIdResponse.idToBuy }, function (err, singleItemResponse) {
      if (err) throw err
      console.log(singleItemResponse)
      inquirer.prompt([
        {
          message: `How many ${singleItemResponse[0].product_name} would you like?`,
          type: 'input',
          name: 'quantityPurchased',
          validate: function (input) {
            if (parseFloat(input) < parseFloat(singleItemResponse[0].stock_quantity) && parseFloat(input) >= 0) {
              return true
            } else {
              return `Please enter a valid number between 0 and ${singleItemResponse[0].stock_quantity}, 0 to cancel.`
            }
          }
        }
      ]).then(updateItem(quantityRepsonse))
    })
  }
}

function updateItem(quantityRepsonse) {
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: singleItemResponse[0].stock_quantity - quantityRepsonse.quantityPurchased,
        product_sales: singleItemResponse[0].product_sales + (singleItemResponse[0].price * quantityRepsonse.quantityPurchased)
      },
      {
        item_id: productIdResponse.idToBuy
      }
    ],
    function (err, res) {
      if (err) throw err;
      console.log(res.affectedRows + " products updated!\n");
      // Call deleteProduct AFTER the UPDATE completes
      console.log(`Total Cost: $${quantityRepsonse.quantityPurchased * singleItemResponse[0].price}`)
      displayDB()
    }
  );
}
