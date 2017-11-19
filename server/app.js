var express = require('express');
var fs = require('fs'); // file system, to save files
var request = require('request');
var url = require('url'); // to parse URL and separate filename from path
var progress = require('progress-stream'); // to have a progress bar during upload
var watson = require('watson-developer-cloud');
const rp = require('request-promise');

var app = express();

var multer = require('multer'); // library to uplaod photos https://github.com/expressjs/multer

// storage used with Multer library to define where to save files on server, and how to save filename
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        //console.log(file.mimetype)
        cb(null, file.originalname + '-' + Date.now() + '-' + getExtension(file));
    }
});

function getExtension(file) {
    // this function gets the filename extension by determining mimetype. To be exanded to support others, for example .jpeg or .tiff
    var res = '';
    if (file.mimetype === 'image/jpeg') res = '.jpg';
    if (file.mimetype === 'image/png') res = '.png';
    return res;
}

function getWatsonData(path) {
    return new Promise((resolve, reject) => {
        var visual_recognition = watson.visual_recognition({
            api_key: '8d7aced8efa9ce11cca985d203dce5989cc20148',
            version: 'v3',
            version_date: '2016-05-20'
          });

          var params = {
            images_file: fs.createReadStream(path),
            parameters:  {
              classifier_ids:['people_427308620']
            }


            //images_file: fs.createReadStream('./resources/car.png')
          };

          visual_recognition.classify(params, function(err, res) {
            if (err)
                reject(err);
              //console.log(err);
            else
                resolve(JSON.stringify(res, null, 2));
              //console.log(JSON.stringify(res, null, 2));
          });
    });
};


app.use(express.static('./')); // serve all files in root folder, such as index.html

// initialize Multer with storage definition and other options like limit to file size that can be uploaded
var upload = multer({
    storage: storage,
    // limits: { fileSize: 1048576, files: 1 } // limit file size to 1048576 bytes or 1 MB
    //,fileFilter: // TODO limit types of files. currently can upload a .txt or any kind of file into uploads folder
}).fields([ // fields to accept multiple types of uploads
    { name: "fileName", maxCount: 1 } // in <input name='fileName' />
]);


// for input type=file
app.post('/uploads', async function (req, res, next) {

  var prog = progress({time:100},function(progress){ // time:100 means will check progress every 100 ms, say to update progress bar
    // NOTE may need to increase accepted file size to see any kind of progress, might be too fast
    var len = this.headers['content-length'];
    var transf = progress.transferred;
    var result = Math.round(transf/len * 100)+'%';
    console.log(result); // writes progress to console. does not work with images from internet, only file uploads
    //if (result != '100%') res.send(result)
  });

  req.pipe(prog);
  prog.headers = req.headers;

    upload(prog, res, async function (err) { // changed req to prog in order to track % upload progress
        if (err) {
            res.status(err.status || 500).json({ "error": { "status_code": err.status || 500, "message": err.code } });
            return;
        } else {

            if (prog.files.fileName) { // fileName comes from input element:   <input type="file" name="fileName">

                res.writeHead(200,{'Content-Type':'text/html'});
                var reqJSON = JSON.stringify(prog.files.fileName, null, 2); // pretty print the JSON for <pre> tag
                //console.log(reqJSON);
                //res.write("<h1>Uploaded from file</h2><img style='max-width:20%' src='" + prog.files.fileName[0].path + "'/><pre>" + reqJSON + "</pre><a href='/'>Go</a>");


                const watsonResponse = await getWatsonData(prog.files.fileName[0].path);
                const watsonResponseJson = JSON.parse(watsonResponse);

                var person = "";
                var score = 0;
                const persons_length = watsonResponseJson.images[0].classifiers[0].classes.length

                for (var i = 0; i < persons_length; i++){
                  var scor = watsonResponseJson.images[0].classifiers[0].classes[i].score;
                  if (scor > score){
                    score = scor
                    person = watsonResponseJson.images[0].classifiers[0].classes[0].class;
                  }
                }

                //console.log(food);


                res.write("<h1>Secure Vote</h1><img style='max-width:20%' src='" + prog.files.fileName[0].path + "'/><h3>Person:" + person[0].toUpperCase() + person.slice(1) + "</h3><h2>Score: " + score * 100 + "% resemblence </h2> <a href='/'>Go Back</a>");
                res.end();

                var filepath = prog.files.fileName[0].path;
                fs.unlinkSync(filePath);
            }
        }
    });
});




app.listen(3003, function () {
    console.log("Listening on port 3003");
});
