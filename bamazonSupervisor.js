var mysql = require('mysql');
var inquirer = require("inquirer");

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
							//console.log("products");
							console.log("view prod sales");
							fnViewProductSales();
						break;
						case "Create New Department":
							//console.log("low inventory");
							console.log("new department");
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

	console.log("in the view prod sales function");


}

function fnCreateNewDept(){

	console.log("in the create new department function");
}