var fs = require("fs"),
	xml2js = require("xml2js");

var fileContent = null;
var reqIFTypes = null;
var reqIFAttributes = null;
var reqIFObjects = null;
var reqIFHierarchy = null;

var isReady = false;

var isReqIFReady = function(){ 
	return isReady;
}

var readFile = function(path){
	isReady = false;
	fs.exists(path, function(exists) {
		if (exists){
			var parser = new xml2js.Parser();
			fs.readFile(path, function(err, data) {
			    parser.parseString(data, function (err, result) {
			    	if (!err && result){
			    		fileContent = result["REQ-IF"]["CORE-CONTENT"][0]["REQ-IF-CONTENT"][0];
			    		parseContent(fileContent);
			    		isReady = true;
			    	}
			    });
			});
		}
	});
}

/**
 * Prints out the ReqIF data objects as JSON in order of their hierarchy
 * Each object contains the following attributes:
 * "type": (Heading || Requirement)
 * "text" : Text of requirement
 * "id" : The ReqIf id of the spec object (optional)
 * "additionalAttributes" : All other attributes of the spec object (optional) 
 */
var printData = function(printIDs, printAllAttributes){
//	return JSON.stringify(reqIFHierarchy);
	return reqIFHierarchy.printData(printIDs, printAllAttributes);
}

var getJSONSpecTypes = function(content){
	if (content == null)
		return null;
	
	return content["DATATYPES"][0]["DATATYPE-DEFINITION-XHTML"];
}

var getJSONSpecAttributes = function(content){
	if (content == null)
		return null;
	
	return content["SPEC-TYPES"][0]["SPEC-OBJECT-TYPE"][0]["SPEC-ATTRIBUTES"][0]["ATTRIBUTE-DEFINITION-XHTML"];
}

var getJSONSpecObjects = function(content){
	if (content == null)
		return null;
	
	return content["SPEC-OBJECTS"][0]["SPEC-OBJECT"];
}

var getJSONSpecHierarchy = function(content){
	if (content == null)
		return null;
	
	return content["SPECIFICATIONS"][0]["SPECIFICATION"][0];
}

function ReqIFType (jsonSpecType){
	this.id = jsonSpecType["$"]["IDENTIFIER"];
	this.name = jsonSpecType["$"]["LONG-NAME"];
	this.objecttype = "TYPE";
}

function ReqIFAttribute (jsonSpecAttribute, reqIfDatatypes){
	this.id = jsonSpecAttribute["$"]["IDENTIFIER"];
	this.name = jsonSpecAttribute["$"]["LONG-NAME"];
	this.type = reqIfDatatypes[jsonSpecAttribute["TYPE"][0]["DATATYPE-DEFINITION-XHTML-REF"][0]];
	this.objecttype = "ATTRIBUTE";
}

function ReqIFObjectValue (reqIFAttribute, value){
	this.id = reqIFAttribute.id;
	this.name = reqIFAttribute.name;
	this.type = reqIFAttribute.type;
	this.objecttype = "OBJECTVALUE";
	this.value = value; 
}

function ReqIFObject (jsonSpecObject, reqIfAttributes){
	this.id = jsonSpecObject["$"]["IDENTIFIER"];
	this.objecttype = "OBJECT";
	var values = [];
	
	var jsonValues = jsonSpecObject["VALUES"][0]["ATTRIBUTE-VALUE-XHTML"];
	jsonValues.forEach(function(value) {
		var attID = value["DEFINITION"][0]["ATTRIBUTE-DEFINITION-XHTML-REF"][0];
		var attr = reqIfAttributes[attID];
		if (attr){
			values.push(new ReqIFObjectValue(attr, value["THE-VALUE"][0]["xhtml:div"][0]["xhtml:span"][0]["_"]));
		}	
	});
	
	this.values = values;
	
	
	// Functions
	this.collectData = function(printIDs, printAllAttributes) {
        var objectText = "";
        var objectType = "";
        var additionalAttributes = [];
        
        this.values.forEach(function(value) {
        	if (value.name == "ReqIF.ChapterName"){
        		objectType = "Heading";
        		objectText = value.value;
        	}
        	else if (value.name == "ReqIF.Text"){
        		objectType = "Requirement";
        		objectText = value.value;
        	}
        	else {
        		var att = {};
        		att[value.name] = value.value;
        		additionalAttributes.push(att);
        	}
        });
        
        var result = {type : objectType, text : objectText};
        if (printIDs)
        	result["id"] = this.id;
        if (printAllAttributes && additionalAttributes.length > 0){
        	result["additionalAttributes"] = additionalAttributes;
        }
		
		return result;
    };
}

function ReqIFHierarchy (jsonSpecHierarchy, reqIfObjects){
	this.id = jsonSpecHierarchy["$"]["IDENTIFIER"];
	
	this.object = null;
	var objectID = (jsonSpecHierarchy["OBJECT"]) ? jsonSpecHierarchy["OBJECT"][0]["SPEC-OBJECT-REF"][0] : null;
	if (objectID && reqIfObjects[objectID])
		this.object = reqIfObjects[objectID];
		
	var childs = [];
	
	var reqIfChilds = jsonSpecHierarchy["CHILDREN"][0]["SPEC-HIERARCHY"];
	
	if (reqIfChilds){
		reqIfChilds.forEach(function(child){
			childs.push(new ReqIFHierarchy(child, reqIfObjects));
		});
	}
	
	this.childs = childs;
	
	// Functions
	this.printData = function(printIDs, printAllAttributes) {
		var result = [];

		result = this.collectData(printIDs, printAllAttributes, result);
		
		return JSON.stringify(result);
	}
	
	this.collectData = function(printIDs, printAllAttributes, result) {
		if (!result)
			result = [];
		if (this.object)
			result.push(this.object.collectData(printIDs, printAllAttributes));
		
		this.childs.forEach(function(child){
			child.collectData(printIDs, printAllAttributes, result)
		});
		
		return result;
	}
}

function parseContent(content){
	var jsonTypes = getJSONSpecTypes(content);
	var jsonAttributes = getJSONSpecAttributes(content);
	var jsonObjects = getJSONSpecObjects(content);
	var jsonHierarchy = getJSONSpecHierarchy(content);
	
	reqIFTypes = {};
	jsonTypes.forEach(function(type){
		var reqType = new ReqIFType(type);
		reqIFTypes[reqType.id] = reqType;
	});
	
	reqIFAttributes = {};
	jsonAttributes.forEach(function(attr){
		var reqAttr = new ReqIFAttribute(attr, reqIFTypes);
		reqIFAttributes[reqAttr.id] = reqAttr;
	});
	
	reqIFObjects = {};
	jsonObjects.forEach(function(obj){
		var reqObj = new ReqIFObject(obj, reqIFAttributes);
		reqIFObjects[reqObj.id] = reqObj;
	});
	
	reqIFHierarchy = new ReqIFHierarchy(jsonHierarchy, reqIFObjects);
}

module.exports = function(path) {

	readFile(path);

    return {
    	isReqIFReady: isReqIFReady,
    	readFile: readFile,
    	printData: printData
    };
};
