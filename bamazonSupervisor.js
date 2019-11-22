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
      choices: ['View Products Sales by Department', 'Create New Department', 'Exit'],
      name: 'answer',
      type: 'list'
    }
  ]).then(function (response) {
    switch (response.answer) {
      case 'View Products Sales by Department':
        viewSalesByDepartments()
        break
      case 'Create New Department':
        createDepartment()
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

function viewSalesByDepartments() {
  // connection.query(`SELECT department_name, SUM(product_sales) AS summed_product_sales FROM products GROUP BY department_name`,
  //   function (err, departmentSales) {
  //     if (err) throw err
  //     console.log(departmentSales)
  //   })
  connection.query(`SELECT department_id, departments.department_name, over_head_costs, summed_table.summed_product_sales AS product_sales, summed_table.summed_product_sales - over_head_costs AS total_profit FROM departments LEFT JOIN (SELECT department_name, SUM(product_sales) AS summed_product_sales FROM products GROUP BY department_name) AS summed_table ON departments.department_name = summed_table.department_name`,
    function (err, departmentSales) {
      if (err) throw err
      console.log(`Department ID, Department, Overhead Costs, Department Sales, Department Profit`)
      departmentSales.forEach(department => {
        console.log(department.department_id, department.department_name, department.over_head_costs, department.product_sales, department.total_profit)
      })
      displayMenu()
    })
}

function createDepartment() {

  inquirer.prompt([
    {
      message: "Name of Department?",
      type: 'input',
      name: 'departmentName'
    },
    {
      message: "Overhead Cost?",
      type: 'number',
      name: 'overheadCost'
    }
  ]).then(function (newItem) { addNewDepartment(newItem) })

}

function addNewDepartment(newItem) {
  var query = connection.query(
    "INSERT INTO departments SET ?",
    {
      department_name: newItem.departmentName,
      over_head_costs: newItem.overheadCost,
    },
    function (err, res) {
      if (err) throw err
      console.log(res.affectedRows + " product inserted!\n")
      displayMenu()
    })
}
