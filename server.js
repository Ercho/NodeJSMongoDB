var fs = require("fs");
var http = require("http");
var qs = require("querystring");
var socketio = require("socket.io");
var mongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var Operations = require("./modules/Operations.js");

var mongodb;
var opers = new Operations();

var server = http.createServer(function (request, response) {

    console.log(request.url);

    switch (request.method) {
        case "GET":

            // ³adowanie ¿¹danych stron
            if (request.url === "/") {
                fs.readFile("staticDir/index.html", function (error, data) {
                    response.writeHead(200, { 'Content-Type': 'text/html' });
                    response.write(data);
                    response.end();
                })
            }


            break;
        case "POST":
            //servResp(request, response)
            break;

    }
})

server.listen(3000);
console.log("serwer startuje na porcie 3000 - ten komunikat zobaczysz tylko raz");
var io = socketio.listen(server); // server -> server nodejs
mongoClient.connect("mongodb://localhost/3ic2", function (err, db) {
    if (err) console.log(err)
    else console.log("mongo pod³¹czone")
    //tu mo¿na operowaæ na utworzonej bazie danych db lub podstawiæ jej obiekt 
    // pod zmienn¹ widoczn¹ na zewn¹trz
    mongodb = db;
    db.createCollection("cw1", function (err, coll) {
        console.log(coll);
    })
})


io.sockets.on("connection", function (client) {
    client.on("add", function (data) {
        var coll = mongodb.collection("cw1");
        console.log(data);
        opers.Insert(coll, data);
        //console.log(data.posX + " - " + data.posY)
        //io.sockets.emit("mouseposition", { posX: data.posX, posY: data.posY });
    })
    client.on("download", function (data) {
        var coll = mongodb.collection("cw1");
        opers.SelectAll(coll, function (data) {
            client.emit("download", {
                data: data,
            })
        })
    })
    client.on("changePass", function (data) {
        var coll = mongodb.collection("cw1");
        opers.UpdatePassById(ObjectID, coll, data, function (data) {
            opers.SelectAll(coll, function (data) {
                client.emit("download", {
                    data: data,
                })
            })
        })
    })
    client.on("update", function (data) {
        var coll = mongodb.collection("cw1");
        opers.UpdateById(ObjectID, coll, data, function (data) {
            opers.SelectAll(coll, function (data) {
                client.emit("download", {
                    data: data,
                })
            })
        })
    })

})