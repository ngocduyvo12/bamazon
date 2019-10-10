var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "ngcduy123",
    database: "bamazonDB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});


function start() {
    connection.query(`SELECT * FROM items`, function (err, data) {
        if (err) throw err;
        // console.table(data)

        inquirer.prompt([
            {
                type: "list",
                name: "choice",
                message: "What action do you want to take?",
                choices: ["View products for sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
            }
        ]).then(function (res) {
            switch (res.choice) {
                case "View products for sale":
                    viewProduct();
                    break;
                case "View Low Inventory":
                    lowInvent();
                    break;
                case "Add to Inventory":
                    addInvent()
                    break;
                case "Add New Product":
                    addNewProduct();
                    break;
                case "Exit":
                    connection.end();

            }
        })

    })
}

function viewProduct() {
    connection.query(`SELECT * FROM items`, function (err, data) {
        if (err) throw err;
        console.table(data)
        start()
    })
}

function lowInvent() {
    connection.query(`SELECT * FROM items`, function (err, data) {
        if (err) throw err;

        var lowItem = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].Stock < 5) {
                lowItem.push(data[i])
            }
        }
        console.table(lowItem)
        start()
    })
}

function addInvent() {
    connection.query(`SELECT * FROM items`, function (err, data) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                name: "itemId",
                message: "Enter the Id of the item you want to add (press 'q' to exist)"
                // validate: function( value ) {
                //     var valid = !isNaN(parseFloat(value));
                //     return valid || "Please enter a number";
                // }
            }
        ]).then(function (res) {
            if (res.itemId === "q") {
                start()
            } else {

                inquirer.prompt([
                    {
                        type: "number",
                        name: "addQuantity",
                        message: "How many do you want to add?"
                    }
                ]).then(function (answer) {
                    // console.log(`it hit`)
                    var chosenItem;
                    // var chosenQuantity;
                    for (var i = 0; i < data.length; i++) {
                        // console.log(data[i].id, answer.itemId)
                        if (data[i].id === parseInt(res.itemId)) {
                            chosenItem = data[i]
                            // console.log(data[i])
                        }
                    }
                    //get total of item after add
                    var totalAfterAdd = parseInt(answer.addQuantity) + parseInt(chosenItem.Stock)
                    //update to database
                    updateProduct(totalAfterAdd, chosenItem.id)
                    start();
                })
            }
        })
    })
}

function updateProduct(value, itemId) {
    console.log("\nUpdating store's database...\n");
    var query = connection.query(
        "UPDATE items SET ? WHERE ?",
        [
            {
                Stock: value
            },
            {
                id: itemId
            }
        ],
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " products updated!\n");
            // Call deleteProduct AFTER the UPDATE completes
            // deleteProduct();
        }
    );

}

function addNewProduct() {
    connection.query(`SELECT * FROM items`, function (err, data) {
        if (err) throw err;

        inquirer.prompt([
            {
                type: "input",
                name: "newItemProduct",
                message: "What is the name of the product?"
            }
        ]).then(function (res) {

            for (var i = 0; i < data.length; i++) {
                // console.log(res.newItemProduct, data[i].Product)
                if (res.newItemProduct === data[i].Product) {
                    console.log(`\nThere is already a product with the same name. Please select add to inventory instead\n`);

                    return start();
                }
            }

            inquirer.prompt([
                {
                    name: "newItemDepartment",
                    message: "What department is this item in?"
                },
                {
                    type: "number",
                    name: "newItemPrice",
                    message: "What is the price of this product?"
                },
                {
                    type: "number",
                    name: "newItemStock",
                    message: "How many are in stock?"
                }

            ]).then(function (answer) {
                console.log("\nUpdating store's database...\n");
                connection.query(`INSERT INTO items SET ?`,
                    {
                        Product: res.newItemProduct,
                        Department: answer.newItemDepartment,
                        Price: answer.newItemPrice,
                        Stock: answer.newItemStock
                    }, function (err, data) {
                        if (err) throw err
                        console.log(`Added ${answer.newItemStock} ${res.newItemProduct} into the database\n`);
                    })
                    start();
                    
            })


        })
    })
}