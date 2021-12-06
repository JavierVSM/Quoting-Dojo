const mongoose = require ('mongoose');

const QuotesSchema = new mongoose.Schema({
    author: String,
    quote: String,
    created_at: Date
});

const Quote = mongoose.model ('quote', QuotesSchema);

const QuoteModel={
    createQuote: function(newQuote){
        return Quote.create(newQuote);
    },
    getQuotes:function(){
        return Quote.find();
    },
};

module.exports = {QuoteModel};