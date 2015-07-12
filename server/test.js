var request = require('request');
var colors = require('colors');

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: ['blue', 'bold'],
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'grey',
    error: 'red',
    subtitle: ['magenta', 'bold'],
    title: ['blue', 'bold']
});

// TEST VARIABLES

var authToken = null;
var baseUrl = 'http://localhost:8080';
var requests = [];
var self = this;

function callback(err, result) {
    var obj = result || err;
    if (obj.statusCode !== undefined) {
        var statusCode = obj.statusCode/100 === 2  ? obj.statusCode.toString().cyan.bold : obj.statusCode.toString().red.bold;
        console.log('Status code: '.subtitle + statusCode + '\n');
    }
    if (err) console.error(err.toString().error);
    else {
        if (result.body && result.body.token !== undefined) {
            console.log("Updated authorization token".white.bold + "\n");
            authToken = result.body.token;
        }
        console.log('BodyResult:'.subtitle);
        console.log(typeof result.body !== "string" ? JSON.stringify(result.body, null, 2).reset : result.body.reset);
    }
    callNext();
}


// TEST

function get(path) {
    path = baseUrl + path;
    headers = authToken ? { Authorization: 'Bearer ' + authToken } : {};
    request.get(path, {
        headers: headers
    }, callback);
}

function post(path, body) {
    path = baseUrl + path;
    headers = authToken ? { Authorization: 'Bearer ' + authToken } : {};
    request.post(path, {
        headers: headers,
        body: body || {},
        json: true
    }, callback);
}

function remove(path) {
    path = baseUrl + path;
    headers = authToken ? { Authorization: 'Bearer ' + authToken } : {};
    request.del(path, {
        headers: headers
    }, callback);
}

function patch(path, body) {
    path = baseUrl + path;
    headers = authToken ? { Authorization: 'Bearer ' + authToken } : {};
    request.patch(path, {
        headers: headers,
        body: body || {},
        json: true
    }, callback);
}

function rq(comment, method, args) {
    requests.push({ comment: comment, method: method, args: args });
}

// REQUESTS

// requests are executed one after the other, only when the previous one
// has finished, and exactly in the following order

rq('Should render index page', get, ['/fdea']);

rq('Should say wrong url', post, ['/fdea']);


rq('Should throw auth error', get, ['/agenda']);
rq('Should throw auth error', post, ['/agenda']);
rq('Should throw auth error', patch, ['/agenda/']);
rq('Should throw auth error', remove, ['/agenda']);

rq('Should throw auth error', get, ['/contact']);
rq('Should throw auth error', post, ['/contact']);
rq('Should throw auth error', patch, ['/contact']);
rq('Should throw auth error', remove, ['/contact']);

rq('Should say missing attributes', post, ['/user', {} ]);

rq('Register user albertsgrc', post, ['/user', { name: 'albertsgrc', password: '4832' }]);

rq('Should say invalid username or password', post, ['/user/authenticate', {}]);
rq('Should say invalid username', post, ['/user/authenticate', { name: 'albertsdagrc', password: '4832' }]);
rq('Should say invalid password', post, ['/user/authenticate', { name: 'albertsgrc', password: '48322' }]);

rq('Authenticate user albertsgrc', post, ['/user/authenticate', { name: 'albertsgrc', password: '4832' }]);

rq('Should output empty list', get, ['/contact']);
rq('Should output empty list', get, ['/agenda']);

rq('Should say required fields', post, ['/contact', {}]);

rq('Create contact Nadà Hakim', post, ['/contact', { _id: "55a2cd8ce151311d183dc0b0", name: "Nadà", surname: "Hakim", company: "Noies guapes", telephone: "661143228" }]);
rq('Should throw not unique error', post, ['/contact', { _id: "52a23d8ae151311d183dd0b0", name: "Nadà", surname: "Hakim", company: "Anus", telephone: "662123228" }]);

rq('Create contact Marc Solano', post, ['/contact', { _id: "57b2cd8ce1512e1d183ac2b0", name: "Marc", surname: "Solano", company: "Anus", telephone: "661123222" }]);

rq('Should show 2 contacts', get, ['/contact']);

rq('Should say required attributes', post, ['/agenda', { }]);

rq('Create agenda Pretty', post, ['/agenda', { _id: "22323d8a3151311d183dd0a0", name: 'Pretty' }]);

rq("Should say contact doesn't exist", patch, ['/agenda/22323d8a3151311d183dd0a0/addContact/22323d8a3151311d183dd0a0']);
rq("Should not do anything because agenda doesn't exist", patch, ['/agenda/21323d8a3151311d183dd0a0/addContact/55a2cd8ce151311d183dc0b0']);

rq('Add contact Nadà to Pretty',  patch, ['/agenda/22323d8a3151311d183dd0a0/addContact/55a2cd8ce151311d183dc0b0']);
rq('Add contact Marta to Pretty',  patch, ['/agenda/22323d8a3151311d183dd0a0/addContact', {  _id: "62a23d8a7152311d183da0b0", name: "Marta", surname: "Barroso", company: "Noies guapes", telephone: "662133228" }]);

rq('Should show one agenda with two contacts', get, ['/agenda']);

rq('Remove contact Marta', remove, ['/contact/62a23d8a7152311d183da0b0']);
rq('Should show one agenda with one contact', get, ['/agenda']);

rq('Register user fcancellara', post, ['/user', { name: 'fcancellara', password: 'daawhooa' }]);
rq('Authenticate user fcancellara', post, ['/user/authenticate', { name: 'fcancellara', password: 'daawhooa' }]);

rq('Get agendas (should be empty)', get, ['/agenda']);
rq('Get contacts (should be empty)', get, ['/contact']);

function functionName(fun) {
    var ret = fun.toString();
    ret = ret.substr('function '.length);
    ret = ret.substr(0, ret.indexOf('('));
    return ret;
}

function end() {
    var Mongodb = require('mongodb');
    var MongoClient = Mongodb.MongoClient;

    var DB_URI = require('../config').DB_URI;

    (function connectToDB() {
        MongoClient.connect(DB_URI, function(err, database) {
            if (err) console.error("Error connecting to database with uri: " + DB_URI);
            else {
                database.dropDatabase(function(err, res) {
                   database.close();
                });
            }
        });
    })();
}

function callNext() {
    String.prototype.repeat = function(times) { var r =  ""; for (var i = 0; i < times; ++i) r += this.toString(); return r; }
    if (requests.length > 0) {
        var req = requests.shift();
        var title = "\n---- " + functionName(req.method).toUpperCase() + ' ' + req.args[0] + " ----";
        console.log((title + "\n" + "=".repeat(title.length - 1)).title);
        if (req.args.length > 1) console.log("BodySent:\n".subtitle + JSON.stringify(req.args[1], null, 2) + "\n");
        console.log("Comment:\n".subtitle + req.comment.reset + "\n");
        req.method(req.args[0], req.args.length > 1 ? req.args[1] : null);
    }
    else end();
}

callNext();



