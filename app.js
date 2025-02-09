const fs = require("fs");

fs.writeFile("copy/Hello.txt", "Hi, it's Nischal", function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Done writing to file!");
    }
});
