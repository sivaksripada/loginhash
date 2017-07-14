var strsplit = require('strsplit');
var csvWriter = require('csv-write-stream');
var LineByLineReader = require('line-by-line');
var multer = require('multer')
var upload = multer({ dest: 'uploads/' });
var fs = require('fs');


module.exports = {




 parseTextFile : function (thefilename, cb) {
    var patients = [];
    var lineNumber = 0;
    lr = new LineByLineReader(thefilename);
    lr.on('line', function(line) {
        if (line != "") {
            var words = strsplit(line, /\s+/);


            //obtain keyword and use the keyword as the reference for other items
            var keyword = 0; //word that has the comma 
            for (var s = 0, len = 5; s < len; s++) {
                if (words[s].slice(-1) === ",") {
                    keyword = s;
                };
            };
            var lastName = "";
            //check to see if lastname is 2 words or one word
            if (keyword > 1) {
                for (var u = 1, len = keyword; u <= len; u++) {
                    lastName = lastName.concat(words[u] + " ");
                };
                lastName = lastName.substring(0, lastName.length - 2);

            } else {
                lastName = words[keyword].substring(0, words[keyword].length - 1);
            };


            //firstname is always the first word after keyword
            var firstName = words[keyword + 1];
            //DOB is the first 'word' after the keyword that has a number in it
            for (var t = 3, len = 10; t < len; t++) {
                if (!isNaN(words[t].substring(1, 0))) {
                    var dateOfBirth = words[t];
                    break;
                };
            };
            //skip the first line as it contains no needed information
            //will add header to csv file when writing the file later
            //otherwise create array with firstname, lastname and dob
            if (lineNumber > 0) {
                patients[lineNumber - 1] = [firstName, lastName, dateOfBirth];
            };
            lineNumber++;
        };
    });
    lr.on('end', function() {

 
        fs.unlinkSync(thefilename); //delete temp file
        //create the output file called for now out.csv
        //var writer = csvWriter({headers:false}); <--- this line is creating error
        var writer = csvWriter({ headers: ["first_name", "last_name", "birthdate"] })
        writer.pipe(fs.createWriteStream('uploads/out.csv'))
        for (var i = 0, len = patients.length; i < len; i++) {
            writer.write(patients[i]);
        }
        writer.end();
        cb();

    });

}


};