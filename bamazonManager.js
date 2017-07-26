var mysql = require('mysql');
var inquirer = require("inquirer");
var myDataKeys = require("./keys.js");
var keys = myDataKeys.dtkeys;
var con = mysql.createConnection({
		  host: "localhost",
		  user: keys['user'],
		  password: keys['password'],
		  database: keys['database']
		});

	function takeAction(){
		inquirer
			.prompt([
			    {
			      type: "checkbox",
			      message: "What management task would you like to perform?",
			      choices: ['View Products For Sale', 'View Low Inventory', 'Add To Inventory', 'Add New Product'],
			      name: "reqaction"
			    },
			    {
			      type: "confirm",
			      message: "Are you sure:",
			      name: "confirm",
			      default: true    
			    }]).then(function(inquirerResponse) {
    
		    		if (inquirerResponse.confirm == true) {

		    			switch(inquirerResponse.reqaction[0]){
						case "View Products For Sale":
							console.log("products");
							fnViewProducts();
						break;
						case "View Low Inventory":
							console.log("low inventory");
							fnViewLowInventory();
						break;
						case "Add To Inventory":
							console.log("add inventory");
							fnAddInventory();
						break;
						case "Add New Product":
							console.log("new product");
						break;
						default:
							console.log("Did not recognize the command");
						break;
						}
		    		}
		    	});
	}

takeAction();


//List a set of menu options:
//View Products for Sale
//If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
function fnViewProducts(){
		con.connect(function(err) {
		  if (err) throw err;
		  var sql = "SELECT * FROM products";
		  con.query(sql, function (err, result) {
		    if (err) throw err;
		    //output results formatted nicely
		    console.log("======================PRODUCTS LISTING====================");
		    console.log("ID             Product Name                 Price             In Stock");
		    for(i = 0; i < result.length; i++){
		    	console.log(result[i].item_id + "     " + result[i].product_name + "     " + result[i].price + "         " + result[i].stock_quantity);
		    }
			});

		});
	}

//View Low Inventory
//If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
function fnViewLowInventory(){
		con.connect(function(err) {
		  if (err) throw err;
		  var sql = "SELECT * FROM products WHERE stock_quantity < 200";
		  con.query(sql, function (err, result) {
		    if (err) throw err;
		    //output results formatted nicely
		    console.log("=============LOW INVENTORY PRODUCTS LISTING====================");
		    console.log("ID             Product Name                 Price             In Stock");
		    for(i = 0; i < result.length; i++){
		    	console.log(result[i].item_id + "     " + result[i].product_name + "     " + result[i].price + "         " + result[i].stock_quantity);
		    }
			});

		});
	}


//Add to Inventory
//If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
function fnAddInventory(){
con.connect(function(err) {
		  if (err) throw err;
		  var sql = "SELECT * FROM products";
		  con.query(sql, function (err, result) {
		    if (err) throw err;
		    var strChoices = [];
		    for(i = 0; i < result.length; i++){
			    strChoices.push(result[i].product_name);
		    }
		    			inquirer
						  .prompt([
						    {
						      type: "checkbox",
						      message: "What management task would you like to perform?",
						      choices: strChoices,
						      name: "productname"
						    },
						    {
						      type: "confirm",
						      message: "Are you sure:",
						      name: "confirm",
						      default: true
						    }]).then(function(inquirerResponse) {
						    	if (inquirerResponse.confirm == true) {
						    		var strProduct = inquirerResponse.productname;
						    		inquirer
										  .prompt([
										    {
										      type: "checkbox",
										      message: "How many units to add to stock?",
										      choices: ["50", "100", "150", "200"],
										      name: "quantity"
										    },
										    {
										      type: "confirm",
										      message: "Are you sure:",
										      name: "confirm",
										      default: true
										    }]).then(function(inquirerResponse) {
										    	if (inquirerResponse.confirm == true) {
										    	   	console.log(inquirerResponse.quantity);
										    		fnRestock(strProduct, inquirerResponse.quantity);
										    }
										    });

						    }
						    });
			});

		});

}

function fnRestock(ProductName, Quantity){
	var sql = "UPDATE products SET stock_quantity = stock_quantity + " + Quantity + 
	" WHERE product_name = '" + ProductName + "'";
	con.query(sql, function (err, result) {
	   	if (err){
	   		throw err;
	   	} 
	   	else{
	   		console.log(ProductName + " stock has been updated.");
	   	}
		    //output results formatted nicely
	});

}						

//Add New Product
//If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.