var fs = require("fs");

module.exports = function(excelPath) {
	var XLSX = require('xlsx');
	var workbook = null;
	fs.exists(excelPath, function(exists) {
		if (exists)
			workbook = XLSX.readFile(excelPath);
	});
		
    return {
    	
    	TYPE_NUMBER: function() { 
    		return n;
    	},
    	TYPE_STRING: function() { 
    		return s;
    	},
    	TYPE_BOOLEAN: function() { 
    		return b;
    	},
    	TYPE_DATE: function() { 
    		return d;
    	},
    	isWorkbookReady: function() { 
    		return (workbook);
    	},
    	getSheetByID: function(id){
    		var first_sheet_name = workbook.SheetNames[id];
        	return workbook.Sheets[first_sheet_name];
    	},
    	getSheetByName: function(name){
    		return workbook.Sheets[name];
    	},
    	findCellByText: function(text, sheet){
    		
    	},
    	findCellByCoordinates: function(column, row, sheet){
    		
    	},
    	insertRow: function(rowBefore, sheet){
    		
    	},
    	saveFile: function(path, callback){
    		XLSX.writeFileAsync(workbookPath, workbook, callback);
    	},
    	changeCellType: function(cell, type){
    		cell.t = type;
    	},
    	changeCellValue: function(cell, value){
    		cell.v = value;
    	}
    };
};
