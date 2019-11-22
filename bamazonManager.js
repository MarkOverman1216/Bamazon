var mysql = require("mysql")
var inquirer = require("inquirer")
var dataSet
var connection = mysql.createConnection({
  host: "localhost",

  // Your port if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "NaG7nyJ8$bU&&j4q",
  database: "bamazonDB"
})

connection.connect(function (err) {
  if (err) throw err
  displayMenu()
})

function displayMenu() {
  inquirer.prompt([
    {
      message: 'What would you like to do?',
      choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit'],
      name: 'answer',
      type: 'list'
    }
  ]).then(function (response) {
    switch (response.answer) {
      case 'View Products for Sale':
        viewProducts()
        break
      case 'View Low Inventory':
        viewLow()
        break
      case 'Add to Inventory':
        addInventory()
        break
      case 'Add New Product':
        addProduct()
        break
      case 'Exit':
        connection.end()
        break

      default:
        //Should never get here because I only have 4 options... and you can't change them.
        displayMenu()
        break
    }
  })
}

function viewProducts() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err
    // Log all results of the SELECT statement
    res.forEach(row => {
      console.log(row.item_id, row.product_name, row.price, row.stock_quantity)
    })
    displayMenu()
  })
}
// -----------------------------------------------------------------------------------------
function viewLow() {
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
    if (err) throw err
    // Log all results of the SELECT statement
    res.forEach(row => {
      console.log(row.item_id, row.product_name, row.department_name, row.price, row.stock_quantity)
    })
    displayMenu()
  })
}
// -------------------------------------------------------------------------

function addInventory() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err
    // Log all results of the SELECT statement
    dataIDs = []
    res.forEach(row => dataIDs.push(row.item_id))
    inquirer.prompt([
      {
        message: 'What is the ID of the product you wish to re-stock?',
        type: 'list',
        choices: dataIDs,
        name: 'idToRestock'
      }
    ]).then(function (response) {
      selectSingle(response)
    })
  })


}


function selectSingle(productIdResponse) {
  console.log('gotToSelect')
  connection.query("SELECT * FROM products WHERE ?", { item_id: productIdResponse.idToRestock }, function (err, singleItemResponse) {
    if (err) throw err
    console.log(singleItemResponse)
    inquirer.prompt([
      {
        message: `How many ${singleItemResponse[0].product_name} would you like to add?`,
        type: 'number',
        name: 'quantityAdded',
      }
    ]).then(function (quantityResponse) { updateItem(quantityResponse, singleItemResponse, productIdResponse) })
  })
}

function updateItem(quantityResponse, singleItemResponse, productIdResponse) {
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: singleItemResponse[0].stock_quantity + quantityResponse.quantityAdded
      },
      {
        item_id: productIdResponse.idToRestock
      }
    ],
    function (err, res) {
      if (err) throw err
      console.log(res.affectedRows + " products updated!\n")
      displayMenu()
    }
  )
}

// -----------------------------------------------------------------------
function addProduct() {
  inquirer.prompt([
    {
      message: "Name of item?",
      type: 'input',
      name: 'itemName'
    },
    {
      message: "Name of department?",
      type: 'input',
      name: 'itemDepartment'
    },
    {
      message: "Price of item?",
      type: 'number',
      name: 'itemPrice'
    },
    {
      message: "Stock Quantity?",
      type: 'number',
      name: 'itemStock'
    }
  ]).then(function (newItem) { addNewProduct(newItem) })
}

function addNewProduct(newItem) {
  var query = connection.query(
    "INSERT INTO products SET ?",
    {
      product_name: newItem.itemName,
      department_name: newItem.itemDepartment,
      price: newItem.itemPrice,
      stock_quantity: newItem.itemStock
    },
    function (err, res) {
      if (err) throw err
      console.log(res.affectedRows + " product inserted!\n")
      displayMenu()
    })
}
