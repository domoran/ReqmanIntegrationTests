var fs = require("fs");
var XLSX = require('xlsx');
var workbook = null;


var isWorkbookReady = function() { 
	return (workbook != null);
}

var getSheetByID = function(id){
	var first_sheet_name = workbook.SheetNames[id];
	return workbook.Sheets[first_sheet_name];
}

var getSheetByName = function(name){
	return workbook.Sheets[name];
}

var findCellsByValue = function(value, sheet, startRow, inColumn, inRow){
	var result = [];
	var range = XLSX.utils.decode_range(sheet['!ref']);
	
	if (inColumn && inRow){
		var cell = findCellByCoordinates(inColumn, inRow, sheet)
		if (cell)
			result.push(cell);
	}
	else if (inColumn){
		var R;
		if (startRow)
			R = startRow;
		else
			R = range.s.r
		for(R; R <= range.e.r; ++R) {
			var cell_address = {c:inColumn, r:R};
			var cell = sheet[XLSX.utils.encode_cell(cell_address)];
			if (cell && cell.v == value)
				result.push(cell);
		}
	}
	else if (inRow){
		for(var C = range.s.c; C <= range.e.c; ++C) {
			var cell_address = {c:C, r:inRow};
			var cell = sheet[XLSX.utils.encode_cell(cell_address)];
			if (cell && cell.v == value)
				result.push(cell);
		}
	}
	else {
		var R;
		if (startRow)
			R = startRow;
		else
			R = range.s.r
		for(R; R <= range.e.r; ++R) {
			for(var C = range.s.c; C <= range.e.c; ++C) {
				var cell_address = {c:C, r:R};
				var cell = sheet[XLSX.utils.encode_cell(cell_address)];
				if (cell && cell.v == value)
					result.push(cell);
			}
		}
	}

	return result;
}

var findCellByCoordinates = function(column, row, sheet){
	if(typeof column == "number"){
		var cell_address = {c:column, r:row};
		return sheet[XLSX.utils.encode_cell(cell_address)]
	}
	else {
		return sheet[column.concat(row)]
	}
}

var insertEmptyRow = function(rowAfter, sheet){
	var emptyCell = {t:'?', v:''};
	var range = XLSX.utils.decode_range(sheet['!ref']);

	if(range.s.r > rowAfter) range.s.r = rowAfter;
	if(range.e.r < rowAfter) range.e.r = rowAfter + 1;
	else range.e.r = range.e.r + 1
	sheet['!ref'] = XLSX.utils.encode_range(range);
	
	for(var R = range.e.r - 1; R >= rowAfter; --R) {
	    for(var C = range.s.c; C <= range.e.c; ++C) {
	    	var cell_address = {c:C, r:R};
	    	var newRow = R + 1;
	    	var new_cell_address = {c:C, r:newRow};
	    	
	    	var cell = sheet[XLSX.utils.encode_cell(cell_address)];
	    	sheet[XLSX.utils.encode_cell(new_cell_address)] = cell;
	    }
	}
	
	// Set types of new row according to old row
	for(var C = range.s.c; C <= range.e.c; ++C) {
		var cell_address = {c:C, r:rowAfter};
		var old_cell_address = {c:C, r:rowAfter + 1};
		var old_cell = sheet[XLSX.utils.encode_cell(old_cell_address)];
		if (old_cell){
			var new_cell = {t:old_cell.t, v:undefined};
			sheet[XLSX.utils.encode_cell(cell_address)] = new_cell;
		}
	}
}

var insertRow = function(rowAfter, sheet, values){
	insertEmptyRow(rowAfter, sheet);
	
	for(var C = 0; C <= values.length; ++C) {
		var cell_address = {c:C, r:rowAfter};
		var cell = sheet[XLSX.utils.encode_cell(cell_address)];
		var value = values[C];
		
		cell = setCellValue(value, cell);
		
		sheet[XLSX.utils.encode_cell(cell_address)] = cell;
	}
}

var saveFile = function(path, callback){
	XLSX.writeFileAsync(path, workbook, callback);
}
var readFile = function(path){
	fs.exists(path, function(exists) {
		if (exists)
			workbook = XLSX.readFile(path);
		
		return exists;
	});
}

var changeCellType = function(cell, type){
	cell.t = type;
}

var changeCellValue = function(cell, value){
	cell.v = value;
}

var getRow = function(rowId, sheet){
	var range = XLSX.utils.decode_range(sheet['!ref']);
	var row = [];
	for(var C = range.s.c; C <= range.e.c; ++C) {
		var cell_address = {c:C, r:rowId};
		var cell = sheet[XLSX.utils.encode_cell(cell_address)];
		row[C] = cell;
	}
	
	return row;	
}

var getColumn = function(colId, sheet){
	var range = XLSX.utils.decode_range(sheet['!ref']);
	var col = [];
	for(R = range.s.r; R <= range.e.r; ++R)  {
		var cell_address = {c:colId, r:R};
		var cell = sheet[XLSX.utils.encode_cell(cell_address)];
		col[R] = cell;
	}
	
	return col;	
}

var convertSheetToJSON = function(sheet, startRow){
//	if (startRow)
//		return XLSX.utils.sheet_to_json(sheet, {raw: false, header: 1, range: startRow});
//	else
//		return XLSX.utils.sheet_to_json(sheet, {raw: false, header: 1});
	if (startRow)
		return createSheetJSON(sheet, startRow);
	else
		return createSheetJSON(sheet, 0);
}

var createSheetJSON = function(sheet, startRow){
	var range = XLSX.utils.decode_range(sheet['!ref']);
	var json = [];
	
	for(R = startRow; R <= range.e.r; ++R) {
		var row = [];
		var emptyRow = true;
		
		for(var C = range.s.c; C <= range.e.c; ++C) {
			value = "";
			var cell_address = {c:C, r:R};
			var cell = sheet[XLSX.utils.encode_cell(cell_address)];
			
			if (cell && cell.v) {
				if (typeof cell.v == "string")
					value = cell.v;
				else
					value = cell.v.toString();
				
				emptyRow = false;
			}
			
			row.push(value);
		}
		
		if (emptyRow)
			json.push([]);
		else
			json.push(row);
	}
	
	return json;
}

var getTypeOfValue = function(value){
	if(typeof value == "string") return 's'; // string
	else if(typeof value == "number") return 'n'; // number
	else if(value === true || value === false) return 'b'; // boolean
	else if(value instanceof Date) return 'd';
}

var setCellValue = function(value, cell){
	if (value){
		if (cell){
			cell.v = value;
			cell.w = undefined;
			if(!cell.t)
				cell.t = getTypeOfValue(value);
		}
		else
			cell = {v:value, t:getTypeOfValue(value)};
	}
	else {
		if (cell)
			cell.v = undefined;
		else
			cell = {v:undefined, t:'s'};
	}
	
	return cell;
}


module.exports = function(path) {

	fs.exists(path, function(exists) {
		if (exists)
			workbook = XLSX.readFile(path);
	});
	
    return {
    	
    	TYPE_NUMBER: function() { 
    		return "n";
    	},
    	TYPE_STRING: function() { 
    		return "s";
    	},
    	TYPE_BOOLEAN: function() { 
    		return "b";
    	},
    	TYPE_DATE: function() { 
    		return "d";
    	},
    	isWorkbookReady: isWorkbookReady,
    	getSheetByID: getSheetByID,
    	getSheetByName: getSheetByName,
    	findCellsByValue: findCellsByValue,
    	findCellByCoordinates: findCellByCoordinates,
    	insertEmptyRow: insertEmptyRow,
    	insertRow: insertRow,
    	saveFile: saveFile,
    	readFile: readFile,
    	changeCellType: changeCellType,
    	changeCellValue: changeCellValue,
    	convertSheetToJSON: convertSheetToJSON
    };
};
