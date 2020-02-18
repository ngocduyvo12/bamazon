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
    //make connection to sql database
    connection.query(`SELECT * FROM items`, function (err, data) {
        if (err) throw err;
        console.table(data)

        //first inquirer prompt for user
        inquirer.prompt([
            {
                type: "list",
                name: "choice",
                message: "Would you like to purchase an item?",
                choices: ["Yes. Take me to the purchase page", "No"]
            }
        ]).then(function (res) {
            switch (res.choice) {
                case "Yes. Take me to the purchase page":
                    purchaseProduct();
                    break;
                case "No":
                    console.log(`Thank you for your business!`)
                    connection.end()
            }
        })

    })
}

function purchaseProduct() {
    //make connection to sql
    connection.query(`SELECT * FROM items`, function (err, data) {

        //second inquirer to have the user select id and quantity
        inquirer.prompt([
            {
                type: "number",
                name: "itemId",
                message: "What is the Id of the item you want to buy?"
            },
            {
                type: "number",
                name: "quantity",
                message: "How many would you like to buy?"
            }
        ]).then(function (answer) {
            console.log(`\nID: ${answer.itemId}`)
            console.log(`quantity: ${answer.quantity}`)

            //isolate the chosen item by id
            var chosenItem;
            // var chosenQuantity;
            for (var i = 0; i < data.length; i++) {
                if (data[i].id === answer.itemId) {
                    chosenItem = data[i]
                }
            }
            // if quantity > Stock then purchase successful:
            if (chosenItem.Stock >= answer.quantity) {
                //let user know purchase is successful:
                console.log(`\nPurchase is Successful`)
                //get the remaining value:
                var remaining = parseInt(chosenItem.Stock) - parseInt(answer.quantity)

                //calculate money spent
                var moneySpent = parseInt(answer.quantity) * parseInt(chosenItem.Price)
                console.log(`\nYou purchased ${answer.quantity} ${chosenItem.Product}. Your total is: ${moneySpent}\n`)

                //update to mysql database
                updateProduct(remaining, chosenItem.id)
                //start over:
                start();
            } else {
                console.log(`Insufficient quantity available. Please check the storage and try again.\n`)
                start();
            }
        })
    })
}


function updateProduct(value, itemId) {
    console.log("Updating store's database...\n");
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
        }
    );

}