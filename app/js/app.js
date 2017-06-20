var variables = null;
var currentsection = '';

$(document).ready(function () {
    variables = new Array();
    var LineByLineReader = require('line-by-line'),
        lr = new LineByLineReader('./src/bootstrap/scss/_custom.scss');

    lr.on('error', function (err) {
        // 'err' contains error object
    });

    lr.on('line', function (line) {
        // 'line' contains the current line without the trailing newline character.
        if (line.substring(0, 2) === "//") {
            // This is a comment so see if it is a section header. section headers were added to the _custom.scss file to make parsing easier and identify the types of controls to use
            if (line.indexOf("Section") > 1) {
                // is a section so set current section to this.
                currentsection = line.split(":")[1];
                //console.log('Current Section: ' + currentsection);
            }
        }
        if (line.substring(0, 1) === "$") {
            // variable found. 
            // is it a hex color
            tmp1 = line.split(":");
            
            //console.log("tmp1[0] = " + tmp1[0] + " :: tmp1[1] = " + tmp1[1]);
            if (tmp1[1].replace(/ /g, "").substring(0, 1) === "#") {
                // this is a hex color so add it to the array as color type
                variables.push({
                    "section": currentsection,
                    "name": tmp1[0],
                    "value": tmp1[1].replace(/ /g, "").replace(/;/g, ""),
                    "type": "hexColor"
                });
            }
            else if (tmp1[1].replace(/ /g, "").substring(0, 1) === "$") {
                // this is a reference to another variable so add it to the array as reference type
                variables.push({
                    "section": currentsection,
                    "name": tmp1[0],
                    "value": tmp1[1].replace(/ /g, "").replace(/;/g, ""),
                    "type": "reference"
                });
            }
            else if (tmp1[1].replace(/ /g, "").indexOf("true;") == 0 || tmp1[1].replace(/ /g, "").indexOf("false;") == 0){
                // this is a boolean
                variables.push({
                    "section": currentsection,
                    "name": tmp1[0],
                    "value": tmp1[1].replace(/ /g, "").replace(/;/g, ""),
                    "type": "boolean"
                });
            }
            else {
                // for now, this is just text
                variables.push({
                    "section": currentsection,
                    "name": tmp1[0],
                    "value": tmp1[1].replace(/ /g, ""),
                    "type": "text"
                });
            }
        }
    });

    lr.on('end', function () {
        // All lines are read, file is closed now.
        console.log("Finished Reading File");
        var txt = JSON.stringify(variables);
        $("#txtArea1").text(txt);
    });
});