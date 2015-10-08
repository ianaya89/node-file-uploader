'use strict';
var path = require('path'),
    express = require('express'),
    _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    bodyParser = require('body-parser'),
    multipart = require('connect-multiparty'),
    multipartyMiddleware = multipart(),
    app = express(),
    fileFolderPath = './public/files/',
    uploadDir = path.resolve(__dirname, fileFolderPath);
//configs
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('connect-livereload')());
// View
app.get('/', function(req, res) {
    res.sendFile('public/index.html', {
        root: __dirname
    });
});
app.get('/api/file/', function(req, res) {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    fs.readdir(uploadDir, function(err, files) {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send(files)
        }
    });
});
app.post('/api/file/', multipartyMiddleware, function(req, res) {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    fs.readFile(req.files.file.path, function(err, data) {
        var createDir = uploadDir + '/' + req.files.file.name;
        fs.writeFile(createDir, data, function(err) {
            if (err) {
                res.status(400).send(err)
            } else {
                res.status(200).send()
            }
        });
    });
})

app.put('/api/file/:id/:newid', function(req, res) {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    var putDir = path.resolve(uploadDir, req.params.id);
    var newPutDir = path.resolve(uploadDir, req.params.newid);
    fs.rename(putDir, newPutDir, function(err) {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send()
        }
    });
});
app.get('/api/file/:id', function(req, res) {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    var getDir = path.resolve(uploadDir, req.params.id);
    fs.readFile(getDir, function(err, data) {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send(data)
        }
    });
});
app.get('/api/stat/:id', function(req, res) {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    var getDir = path.resolve(uploadDir, req.params.id);
    fs.stat(getDir, function(err, stat) {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send(stat)
        }
    });
});
app.get('/api/access/:id', function(req, res) {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    var getDir = path.resolve(uploadDir, req.params.id);
    fs.access(getDir, fs.R_OK | fs.W_OK, function(err) {
        if (err) {
            res.status(400).send({
                access: 'no access to ' + req.params.id
            })
        } else {
            res.status(200).send({
                access: 'can read/write on ' + req.params.id
            })
        }
    });
});
app.get('/api/exists/:id', function(req, res) {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    var getDir = path.resolve(uploadDir, req.params.id);
    fs.exists(getDir, function(exists) {
        if (exists) {
            res.status(400).send({
                access: req.params.id + ' is there!'
            })
        } else {
            res.status(200).send({
                access: req.params.id + ' is not there'
            })
        }
    });
});
app.delete('/api/file/:id', function(req, res) {
    var deleteDir = path.resolve(uploadDir, req.params.id);
    if (fs.existsSync(deleteDir)) {
        fs.unlink(deleteDir, function(err) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(200).send();
            }
        });
    }
});

app.listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});