var mysql = require('mysql');
var inquirer = require("inquirer");
var nicetable = require('console.table');

var mysql = require('./mysql.js').pool;
	function takeAction(){
		inquirer
			.prompt([
			    {
			      type: "checkbox",
			      message: "Please select a supervisor option:",
			      choices: ['View Products Sales by Department', 'Create New Department'],
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
						case "View Products Sales by Department":
							fnViewProductSales();
						break;
						case "Create New Department":
							fnCreateNewDept();
						break;
						default:
							console.log("Did not recognize the command");
						break;
						}
		    		}
		    	});
	}

takeAction();


function fnViewProductSales(){

	mysql.getConnection(function(err, conn){
		
		  if (err) throw err;
		  var sql = "SELECT department_id, department_name, over_head_costs, product_sales, " +
		  "(product_sales - over_head_costs) as total_profit from departments";
		  conn.query(sql, function (err, result) {
		    if (err) throw err;
		    //console.table(['ID', 'Department Name', 'Overhead Costs', 'Product Sales', 'Total Profit'], result);
			//console.table(result[0], result.slice(1));
			console.table(result);
			if(conn){
			 	conn.release();
			 	mysql.end();
			 	
			}
			});

		});



}

function fnCreateNewDept(){

	mysql.getConnection(function(err, conn){
		if (err){
			throw err;
		} 
		var sql = "SELECT department_name FROM departments";
		conn.query(sql, function (err, result) {
			if (err){
				throw err;
			} 
			else{
				//populate array of departments to select from
				var strDepts = [];
			    for(i = 0; i < result.length; i++){
			    	//console.log(result[i].department_name);
				    strDepts.push(result[i].department_name);
			    }
			}
		
		inquirer
			.prompt([
			{
				type: "input",
				message: "What is the name of the new department?",
				name: "deptname"
			},
			{
				type: "input",
				message: "What are the Overhead Costs associated with this department?",
				name: "overhead"
			},
			{
				type: "confirm",
				message: "Confirm to add new department. Sales will be initially set to zero.",
				name: "confirm",
				default: true
				}]).then(function(inquirerResponse) {
				if (inquirerResponse.confirm == true) {
					var sql = "insert into departments(department_name, over_head_costs, product_sales) values( " +
					"'" + inquirerResponse.deptname + "', '" + inquirerResponse.overhead + "', 0.00)"; 
					conn.query(sql, function (err, result) {
				   	if (err){
				   		throw err;
				   	} 
				   	else{
				   		console.log(inquirerResponse.deptname + " has been added to the departments database.");
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