$(document).ready(function () {
    alert("Woohoo from jQuery!");
    var fs = require('fs'); // Load the File System to execute our common tasks (CRUD)

    fs.readFile('C:\Workspace\Repositories\SPGizmos\node_modules\bootstrap-v4-dev\scss\_variables.scss', 'utf-8', (err, data) => {
        if (err) {
            alert("An error ocurred reading the file :" + err.message);
            return;
        }
        $("#txtArea1").text(data);
    });
    var stop = "stop1";
});
