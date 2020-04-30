const express=require('express')
const cors=require("cors")
const app=express()

const knex=require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'developer',
        password: 'developer',
        database: 'financemanager'
    }
});

app.use(express.json());
app.use(cors())

app.get('/transactions',async function(req,res) {
    const transactions=await knex.select('id','amount','type','details').from('transactions');
    res.json(transactions);
})

app.post("/transactions",async function(req,res) {
    const result=await knex("transactions").insert({
        amount: req.body.amount,
        type: req.body.type,
        details: req.body.details,

    });



    res.json(result[0]);
});

app.put("/transactions/:id",async function(req,res) {
    await knex("transactions")
        .update({amount: req.body.amount,type: req.body.type,details: req.body.details})
        .where({
            id: req.params.id
        });

    res.json();

});


app.delete("/transactions/:id",async function(req,res) {
    await knex("transactions")
        .delete()
        .where({
            id: req.params.id
        });

    res.json();


});

app.listen(8080)