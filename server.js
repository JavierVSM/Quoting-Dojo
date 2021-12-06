const express = require ('express');
const mongoose = require ('mongoose');
const flash = require( 'express-flash' );
const session = require( 'express-session' );
mongoose.connect('mongodb://localhost/quotes_db', {useNewUrlParser: true});

const {QuoteModel} = require( './models/quoteModel' );

const app = express ();

app.set('views', __dirname+ '/views');
app.set ('view engine', 'ejs');

app.use(flash());
app.use(express.urlencoded({extendend:true}) );
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 * 20}//number in miliseconds 
}));

app.get ('/', function (request, response){
    response.render ('index');
});

app.get ('/quotes', function (request, response){
    QuoteModel
        .getQuotes()
        .then (data  => {
            if (data.length == 0){
                throw new Error("There are no quotes to show");
            }
            response.render ('quotes', {quote:data});
        })
        .catch( error => {
            request.flash('start', error.message);
                response.redirect('/');
        });
});

app.post ('/quotes', function (request, response){
    const author= request.body.name;
    const quote= request.body.qoute;
    const created_at= new Date();
    
    const newQuote = {
        author,
        quote,
        created_at
    };
    
    QuoteModel
        .createQuote(newQuote)
        .then( result => {
            response.redirect('/quotes');
        })
        .catch( err => {
            request.flash( 'fail', 'Something goes wrong!' );
            response.redirect( '/' );
            console.log(err);
        });
});

app.listen (8181, function (){
    console.log ("The user server is running on 8181")
});