# bamazon

This homework will attempt to recreate a shopping site with different tier and functionality. There are three tier to this homework, *customer*, *manager*, and *supervisor*. This repo will only have *customer* and *manager* tier.

All tier of this site will require mysql database to run. The database I'm going to use is bamazonDB. Inside this repo is also a .csv file containing a list of items to be used by mysql database to import into the table.

The javascript file **bamazon_customer.js** will be used by customer to buy item from the database.

Here is a link showing the app working: https://youtu.be/-lwovzuEfaQ

**bamazon_customer.js** require mysql and inquirer npm. The app will start by initialize the connection to mysql and then call the function *start()*.

Inside function *start()* a list will of the item from the database will appear and a prompt will ask the user to select between continuing to the store or exit. If continue is selected, another prompt will appear and ask the user for the item's id and the quantity they want to buy. After The id and quantity have been inputted, the app will calculate the remaining item available in the database and display the item's list again. It will also calculate the total amount of money spent by the user.

This app will run until exit is selected.

**bamazon_manager** is a little more advanced.

Here is the link of bamazon_manager: https://youtu.be/nQDFsm-OSm8

This js file will also require mysql and inquirer npm. After connecting to mysql database, the app will call *start()* function. THis function will then prompt several options in form of list. The options are: 


* View products for sale
* View low inventory
* Add to inventory
* Add new product
* Exit

These options are setup inside a switch case.

* View products for sale
This option will display a list of current items and all of it information.

* View low inventory
This option will display a list of all item with stock quantity lower than 5. To do this, I compared all the items in the database using a for loop and print them out if their stock is lower than 5

* Add to inventory
This option will allow the manager to add more stock to the current stock. Update functionality in mysql is used to update the stock.

* Add new product
This option will let the manager add new product to the list. When the user enter the name of the product, the app will check to see if the product has already been listed and let the user know. If the product has already been listed then go back to the option page. If the product is new then let the user all of the information of the item then add it to the list.

* Exit
Selecting this option will close the connection.
