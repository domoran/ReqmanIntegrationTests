var fs = require("fs");
var ExcelEditor = require("../utils/ExcelEditor");

var editor = null;
var dataSheet = null;
var COLID_PRID = 0;
var COLID_CUSTOMERID = 1;
var COLID_CHAPTER = 2;
var COLID_TYPE = 3;
var COLID_TEXT = 5;
var ROWID_HEADINGS = 3;

var checkDataSheet = function(){
	if (!dataSheet)
		dataSheet = editor.getSheetByID(0);
}

var addRequirement = function(chapter, text, inRow){ 
	checkDataSheet();
	var values = [,"", chapter, "Requirement", , text, , , '', '', '', '' ];
	
	editor.insertRow(inRow, dataSheet, values);
}
var addHeading = function(chapter, text, inRow){ 
	checkDataSheet();
	var values = [,"", chapter, "Heading", , text, , , '', '', '', '' ];
	
	editor.insertRow(inRow, dataSheet, values);
}

var isWorkbookReady = function(){ 
	return editor.isWorkbookReady();
}

var getJSONData = function(withoutObjectIds){
	checkDataSheet();
	
	var json = editor.convertSheetToJSON(dataSheet, ROWID_HEADINGS + 2);
	
	var emptyRows = [];
	var rowID = -1;
	for (row of json){
		rowID++;
		if (!row || row.length == 0) {
			emptyRows.push(rowID);
		}	
		else {
			if (withoutObjectIds) 
				row.splice(COLID_PRID,1);
			for (cell of row){
				if (cell == "")
					cell = undefined;
			}
		}
	}
	
	// Delete empty rows
	for (i = emptyRows.length - 1; i >= 0 ; i--){
		json.splice(emptyRows[i],1);
	} 

	return JSON.stringify(json);
	
}

var getExcelEditor = function(){ 
	return editor;
}

var saveFile = function(path, callback){
	editor.saveFile(path, callback);
}

var changeTextOfRow = function(text, rowID){
	
}

var changeValueOfEntityByGivenValue = function(newValue, oldValue){
	checkDataSheet();
	
	var cells = editor.findCellsByValue(oldValue, dataSheet, ROWID_HEADINGS + 2, COLID_TEXT);
	
	for (cell of cells)
		cell.v = newValue;

}

module.exports = function(path) {

	editor = ExcelEditor(path);
	dataSheet = null;

    return {
    	isWorkbookReady: isWorkbookReady,
    	addRequirement: addRequirement,
    	addHeading: addHeading,
    	changeValueOfEntityByGivenValue: changeValueOfEntityByGivenValue,
    	getJSONData: getJSONData,
    	saveFile: saveFile
    };
};
