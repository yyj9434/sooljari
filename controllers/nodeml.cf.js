const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;

const url = "mongodb://localhost:27017/sooljari"

var Schema = mongoose.Schema;

// var drinksSchema = new Schema(
//     { 
//         index : String,
//         drinksName : String,
//         drinksPrice : String
//     }
// )

// var Drink = mongoose.model('Drink', drinksSchema);

exports.recommendation = (req, res) => {

    let paramsUserId = req.params.userId;
    const {sample, CF, evaluation} = require('../node_modules/nodeml');

    // load movie dataset: user_id movie_id rating like
    const movie = sample.movie();
    
    // split data as train & test
    let train = [], test = [];
    for (let i = 0; i < movie.length; i++) {
        if (Math.random() > 0.8) test.push(movie[i]);
        else train.push(movie[i]);
    }
    
    // set data
    const cf = new CF();
    
    cf.maxRelatedItem = 50;
    cf.maxRelatedUser = 50;
    
    cf.train(train, 'user_id', 'movie_id', 'rating');
    
    // select 100 data for recommendation
    let gt = cf.gt(test, 'user_id', 'movie_id', 'rating');
    let gtr = {};
    let users = [];
    for (let user in gt) {
        gtr[user] = gt[user];
        users.push(user);
        if (users.length === 100) break;
    }
    
    // recommend for 100 users, each 40 movie
    let result = cf.recommendToUsers(users, 2);

    let rec1, rec2;

    MongoClient.connect(url, (err ,db) => {
        let dbo = db.db("sooljari");

        rec1 = dbo.collection("drinks").findOne({index : {$eq : result[paramsUserId][0].itemId }});
        rec2 = dbo.collection("drinks").findOne({index : {$eq : result[paramsUserId][1].itemId }});

        console.log(rec1);
    })

     //Drink.find({index : {$eq : result[paramsUserId][0].itemId }});
     //Drink.find({index : {$eq : result[paramsUserId][1].itemId }});

    console.log(rec1);
    console.log(rec2);

    //let drinksData = Drink.find({index : {$eq : paramsUserId}})


    res.render("index", rec1, rec2);

};