var variables = null;
var currentsection = '';

$(document).ready(function () {
    //alert("Woohoo from jQuery!");
    variables = new Array();
    //var fs = require('fs'); // Load the File System to execute our common tasks (CRUD)

    var LineByLineReader = require('line-by-line'),
        lr = new LineByLineReader('./node_modules/bootstrap-v4-dev/scss/_custom.scss');

    lr.on('error', function (err) {
        // 'err' contains error object
    });

    lr.on('line', function (line) {
        // 'line' contains the current line without the trailing newline character.
        if (line.substring(0, 2) === "//") {
            // console.log('comment found');
            // This is a comment so see if it is a section header. section headers were added to the _custom.scss file to make parsing easier and identify the types of controls to use
            if (line.indexOf("Section") > 1) {
                // is a section so set current section to this.
                currentsection = line.split(":")[1];
                console.log('Current Section: ' + currentsection);
            }
        }
        if (line.substring(0, 1) === "$") {
            // variable found. 
            // is it a hex color
            tmp1 = line.split(":");
            if (tmp1[1].substring(0, 1) === "#") {
                // this is a hex color so add it to the array as color type
                variables.push({
                    section: currentsection,
                    name: tmp1[0],
                    value: tmp1[1],
                    type: "hexColor"
                });
            }
            if (tmp1[1].substring(0, 1) === "$") {
                // this is a reference to another variable so add it to the array as reference type
                variables.push({
                    section: currentsection,
                    name: tmp1[0],
                    value: tmp1[1],
                    type: "reference"
                });
            }
        }
    });

    lr.on('end', function () {
        // All lines are read, file is closed now.
        var txt = JSON.stringify(variables);
        $("#txtArea1").text(txt);
    });


    //fs.readFile('./node_modules/bootstrap-v4-dev/scss/_custom.scss', 'utf-8', (err, data) => {
    //    if (err) {
    //        alert("An error ocurred reading the file :" + err.message);
    //        return;
    //    }
    //    $("#txtArea1").text(data);
    //});
    var stop = "stop1";
});
