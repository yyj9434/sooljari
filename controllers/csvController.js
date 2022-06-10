const csvtojson = require("csvtojson");
const mongodb = require("mongodb");

var url = "mongodb://localhost:27017/sooljari";

var dbConn;
mongodb.MongoClient.connect(url, {
    useUnifiedTopology : true,
}).then((client) => {
    console.log("DB Connected!");
    dbConn = client.db();
}).catch(err => {
    console.log("DB Connection Error : ${err.message}");
});

const fileName = "../database/drinksData.csv";

var arrayToInsert = [];
csvtojson().fromFile(fileName).then(source => {
    for(var i = 0; i < source.length; i++) {
        var oneRow = {
            index : source[i]["index"],
            drinksName : source[i]["drinksName"],
            drinksPrice : source[i]["drinksPrice"]
        };
        arrayToInsert.push(oneRow);
    }

    var collectionName = "drinks";
    var collection = dbConn.collection(collectionName);
    collection.insertMany(arrayToInsert, (err, result) => {
        if(result) {
            console.log("Import CSV into database successfully");
        }
    });
});