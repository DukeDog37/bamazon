var mysql = require('mysql');
var inquirer = require("inquirer");
var mysql = require('./mysql.js').pool;
var nicetable = require('console.table');


function fnGetProducts(){
		//connect to datasource and get product listing		
		mysql.getConnection(function(err, conn){
		  if (err) throw err;
		  var sql = "SELECT * FROM products";
		  
		  conn.query(sql, function (err, result) {
		    if (err) throw err;
		    console.table(result);
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
		    	var sql = "SELECT stock_quantity, product_name, price, department_name FROM products WHERE item_id = " + inquirerResponse.itemid;
		  		conn.query(sql, function (err, result) {
		    		
		    		if (err) throw err;
		    		if(result[0].stock_quantity >= inquirerResponse.quantity){
		      		
		      		//calculate price
		      		var orderPrice = result[0].price * inquirerResponse.quantity;

		      		console.log("Thank you " + inquirerResponse.username + " for " + 
		    		"ordering item " + inquirerResponse.itemid +
		    		" Description: " + result[0].product_name +  
		    		" Count: " + inquirerResponse.quantity);
		    		console.log("Your oder total is: $" + orderPrice);
			    	//update departments total sales
			    	var sqlDeptSaleUpd = "UPDATE departments SET product_sales = (product_sales + " + orderPrice + ") " +
			    	"WHERE department_name = '" + result[0].department_name + "'";

			    	conn.query(sqlDeptSaleUpd, function (err, updateresult) {
		    			if (err){
			    			throw err;
			    		}
			    		else{
			    			console.log(result[0].department_name + " Department Total Sales Updated");
			    		}
			    	});
			    	//update product table record's product_sales with new sale amount
			    	var sqlProdSaleUpd = "UPDATE products SET product_sales = (product_sales + " + orderPrice + ") " +
			    	"WHERE item_id = " + inquirerResponse.itemid;

			    	conn.query(sqlProdSaleUpd, function (err, updateresult) {
		    			if (err){
			    			throw err;
			    		}
			    		else{
			    			//console.log("ITEM_ID: " + inquirerResponse.itemid + " product_sales value updated");
			    		}
			    	});
			    	var intNewQuantity = result[0].stock_quantity - inquirerResponse.quantity;
			    	var sqlUpdateQ = "UPDATE products SET stock_quantity = " + intNewQuantity +
			    	" WHERE item_id = " + inquirerResponse.itemid;
		    		//console.log(sqlUpdateQ);
		    		conn.query(sqlUpdateQ, function (err, updateresult) {
		    			if (err){
			    			throw err;
			    		}
			    		else{
			    			console.log("Inventory Udpated for " + result[0].product_name);
			    			if(conn){
							  	conn.release();
							  	mysql.end();
							 }
		    			} 
			    		
		    		});
		    		
		      	}
		      	else{
		      		console.log("Insufficient Inventory....transaction cancelled.");
		      		conn.release();
		      	}
		      	
		    	});
		      }
		      else{
		      	//did not confirm
		      	console.log(inquirerResponse.username + ", your order has been cancelled...");
		      }

			});
	    
		  });
		  
		});
		
	}

	

fnGetProducts();


