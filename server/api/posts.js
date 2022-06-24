const express = require('express');
const mongodb = require('mongodb');
const axios =  require('axios');

const router = express.Router();

function makeId(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

  
//passy
const uri = "mongodb+srv://usr:passwd@cluster0.xppzh.mongodb.net/?retryWrites=true&w=majority";
const currencyApiKey = '';

//requesty GET
router.get('/cat', async (req,res) => {
    const posts = await loadCategories();
    res.send(await posts.find({}).toArray());
});

router.get('/hou', async (req,res) => {
    const posts = await loadHouses();
    res.send(await posts.find({}).toArray());
});

router.get('/cur/:short', async (req,res) => {
    const currency = req.params.short;
    var multiplier = await axios.get("https://api.apilayer.com/currency_data/convert?to="+currency+'&from=PLN&amount=1', {headers: {"apikey": currencyApiKey}});
    multiplier = multiplier.data.result;
    res.status(200).send({multiplier});
});

//requesty POST
router.post('/cat', async (req,res) => {
    const posts = await loadCategories();
    await posts.insertOne({
        "category": req.body.category
    });
    res.status(201).send();
});

router.post('/hou/cat', async (req,res) => {
    const posts = await loadHouses();
    var obj = {}; 
    obj[req.body.category]="*";
    await posts.updateMany(
        { },{ $set: obj }
    );
    res.status(201).send();
});

router.post('/hou/cat/del', async (req,res) => {
    const posts = await loadHouses();
    var object = {};
    object[req.body.category]='';
    var toRemove = req.body.category;
    await posts.updateMany({},
        { $unset: object }
    )
    res.status(201).send();
});

router.post('/cat/del', async (req,res) => {
    const posts = await loadCategories();
    var object = {};
    object['category']=req.body.category;
    await posts.deleteOne(object);
    res.status(201).send();
});

router.post('/hou', async (req,res) => {
    const posts = await loadHouses();
    var object = {};
    object = req.body.object;
    object.id = object._id;
    delete object._id;
    await posts.updateOne({_id: {$eq: object.id}},{
       $set: object
    },{upsert: true});
    
    res.status(201).send();
});

router.post('/houa', async (req,res) => {
    const posts = await loadHouses();
    var object = {};
    object = req.body.object;

    object._id = makeId(24);
    object.id = object._id;
    await posts.insertOne(object);

    res.status(201).send();
});

router.post('/houd', async (req,res) => {
    const posts = await loadHouses();
    posts.deleteOne(req.body)
})

async function loadCategories() {
    const data = await mongodb.MongoClient.connect(uri,{useNewUrlParser: true});
    return data.db('schronisko').collection('categories');
}

async function loadHouses() {
    const data = await mongodb.MongoClient.connect(uri,{useNewUrlParser: true});
    return data.db('schronisko').collection('houses');
}

module.exports = router;
