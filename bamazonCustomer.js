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



function fnGetProducts(){
		//connect to datasource and get product listing		
		con.connect(function(err) {
		  if (err) throw err;
		  //console.log("Connected!");
		  var sql = "SELECT * FROM products";
		  //console.log(sql);
		  con.query(sql, function (err, result) {
		    if (err) throw err;
		    //console.log(result);
		    //output results formatted nicely
		    console.log("======================PRODUCTS LISTING====================");
		    console.log("ID             Product Name                 Price");
		    for(i = 0; i < result.length; i++){
		    	console.log(result[i].item_id + "     " + result[i].product_name + "     " + result[i].price);


		    }
		    //inquire for product id to purchase
		    inquirer
			.prompt([
			    {
			      type: "input",
			      message: "What is your name?",
			      name: "username"
			    },
			    {
			      type: "input",
			      message: "What is the ID of the product you wish to purchase?",
			      name: "itemid"
			    },
			    {
			      type: "input",
			      message: "How many?",
			      name: "quantity"
			    },
			    {
			      type: "confirm",
			      message: "Are you sure:",
			      name: "confirm",
			      default: true
			    }]).then(function(inquirerResponse) {
    
		    if (inquirerResponse.confirm == true) {
		    	//Need to check quantity of selection
		    	//var haveStock = false;
		    	//haveStock = fnCheckStock(inquirerResponse.itemid);
		    	var sql = "SELECT stock_quantity, product_name FROM products WHERE item_id = " + inquirerResponse.itemid;
		  		//console.log(sql);
		  		con.query(sql, function (err, result) {
		    		//console.log(result);
		    		if (err) throw err;
		    		if(result[0].stock_quantity >= inquirerResponse.quantity){
		      		console.log("We have these in stock");
		      		//check stock
		      		console.log("Thank you " + inquirerResponse.username + " for " + 
		    		"ordering item " + inquirerResponse.itemid +
		    		" Description: " + result[0].product_name +  
		    		" count: " + inquirerResponse.quantity);
		      	}
		      	else{
		      		console.log("Out of stock");
		      	}

		    	});
		      }
		      else{
		      	//did not confirm
		      	console.log(inquirerResponse.username + ", your order has been cancelled...");

		      }
		      	
		      	

			});
			//close database connection
		    //con.end();
		    
		  });
		  
		});
		//con.end();
	}

	function fnCheckStock(itemid){
		var instock = true;
		console.log("Checking quantity of item: " + itemid);
		//connect to datasource and check quantity
		  con.connect(function(err) {
		  if (err) throw err;
		  //console.log("Connected!");
		  var sql = "SELECT stock_quantity FROM products WHERE item_id = " + itemid;
		  console.log(sql);
		  con.query(sql, function (err, result) {
		    console.log(result);
		    if (err) throw err;
		    //console.log(result);
		    //output results formatted nicely
		    console.log(result);

			return instock;
	    	});
		});
			
			
		}

fnGetProducts();
//con.end();
//The app should then prompt users with two messages.
//The first should ask them the ID of the product they would like to buy.
//The second message should ask how many units of the product they would like to buy.