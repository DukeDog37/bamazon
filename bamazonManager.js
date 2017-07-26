var mysql = require('mysql');
var inquirer = require("inquirer");

var mysql = require('./mysql.js').pool;
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
			      message: "Confirm Management Action Selection.",
			      name: "confirm",
			      default: true    
			    }]).then(function(inquirerResponse) {
    
		    		if (inquirerResponse.confirm == true) {

		    			switch(inquirerResponse.reqaction[0]){
						case "View Products For Sale":
							//console.log("products");
							fnViewProducts();
						break;
						case "View Low Inventory":
							//console.log("low inventory");
							fnViewLowInventory();
						break;
						case "Add To Inventory":
							//console.log("add inventory");
							fnAddInventory();
						break;
						case "Add New Product":
							console.log("new product");
							fnAddProduct();
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
		mysql.getConnection(function(err, conn){
		
		  if (err) throw err;
		  var sql = "SELECT * FROM products";
		  conn.query(sql, function (err, result) {
		    if (err) throw err;
		    //output results formatted nicely
		    console.log("======================PRODUCTS LISTING====================");
		    console.log("ID             Product Name                 Price             In Stock");
		    for(i = 0; i < result.length; i++){
		    	console.log(result[i].item_id + "     " + result[i].product_name + "     " + result[i].price + "         " + result[i].stock_quantity);
		    }
		    if(conn){
			 	conn.release();
			 	mysql.end();
			 	
			}
			});

		});
	}

//View Low Inventory
//If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
function fnViewLowInventory(){
		mysql.getConnection(function(err, conn){
		  if (err) throw err;
		  var sql = "SELECT * FROM products WHERE stock_quantity < 200";
		  conn.query(sql, function (err, result) {
		    if (err) throw err;
		    //output results formatted nicely
		    console.log("=============LOW INVENTORY PRODUCTS LISTING====================");
		    console.log("ID             Product Name                 Price             In Stock");
		    for(i = 0; i < result.length; i++){
		    	console.log(result[i].item_id + "     " + result[i].product_name + "     " + result[i].price + "         " + result[i].stock_quantity);
		    }
		    if(conn){
			 	conn.release();
			 	mysql.end();
			 	
			}
			});

		});
	}


//Add to Inventory
//If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
function fnAddInventory(){
		mysql.getConnection(function(err, conn){
		  if (err) throw err;
		  var sql = "SELECT * FROM products";
		  conn.query(sql, function (err, result) {
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
						      message: "Confirm product selection.",
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
										      message: "Confirm to add inventory.",
										      name: "confirm",
										      default: true
										    }]).then(function(inquirerResponse) {
										    	if (inquirerResponse.confirm == true) {
										    	   	//console.log(inquirerResponse.quantity);
										    		fnRestock(strProduct, inquirerResponse.quantity, conn);
										    }
										    });

						    }
						    });
			});

		});

}

function fnRestock(ProductName, Quantity, conn){
	var sql = "UPDATE products SET stock_quantity = stock_quantity + " + Quantity + 
	" WHERE product_name = '" + ProductName + "'";
	conn.query(sql, function (err, result) {
	   	if (err){
	   		throw err;
	   	} 
	   	else{
	   		console.log(ProductName + " stock has been updated.");
	   	}
	   	if(conn){
			 	conn.release();
			 	mysql.end();
			 	
		}
		    //output results formatted nicely
	});

}						

//Add New Product
//If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
function fnAddProduct(){
	//console.log("in function");
	mysql.getConnection(function(err, conn){
		if (err){
			//console.log("in connect error");
			throw err;
		} 
		//console.log("before sql build");
		var sql = "SELECT department_name FROM departments";
		//console.log("before run sql");
		///console.log(sql);
		conn.query(sql, function (err, result) {
			if (err){
				throw err;
			} 
			else{
				//populate array of departments to select from
				//console.log("before pop array of depts");
				var strChoices = [];
			    for(i = 0; i < result.length; i++){
			    	//console.log(result[i].department_name);
				    strChoices.push(result[i].department_name);
			    }
			}
		
		inquirer
			.prompt([
			{
				type: "input",
				message: "What is the name of the product to add?",
				name: "prodname"
			},
			{
				type: "checkbox",
				message: "What Department should the product list under?",
				choices: strChoices,
				name: "deptname"
			},
			{
				type: "input",
				message: "What is the sale price of the new item?",
				name: "saleprice"
			},
			{
				type: "input",
				message: "What amount of stock do you have on hand?",
				name: "stocklevel"
			},
			{
				type: "confirm",
				message: "Confirm to add inventory.",
				name: "confirm",
				default: true
				}]).then(function(inquirerResponse) {
				if (inquirerResponse.confirm == true) {
					var sql = "insert into products(product_name, department_name, price, stock_quantity) values( " +
					"'" + inquirerResponse.prodname + "', '" + inquirerResponse.deptname + "', " + inquirerResponse.saleprice + ", " + inquirerResponse.stocklevel + ")"; 
					conn.query(sql, function (err, result) {
				   	if (err){
				   		throw err;
				   	} 
				   	else{
				   		console.log(inquirerResponse.prodname + " has been added to available products listing.");
				   	}
				   	if(conn){
						 	conn.release();
						 	mysql.end();
						 	
					}
				});
			}
		});
});


		

	});

}