const mongoose = require("mongoose");
const Reviews = require("./reviews");
const reviews = require("./reviews");
const listSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    image : {
        
        filename : String,
        url : String,
        // default : "https://tse3.mm.bing.net/th/id/OIP.CxTwclJKeRFdDWKWis6ZTwHaFj?pid=Api&P=0&h=180",
        // set : (v) => v === "" ? "https://tse3.mm.bing.net/th/id/OIP.CxTwclJKeRFdDWKWis6ZTwHaFj?pid=Api&P=0&h=180": v,
    },
    price : {
        type : Number,
        required : true,
    },
    location : {
        type : String,
        required : true,
    },
    country : {
        type : String,
        required : true,
    },
    reviews : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Review"
    }],
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
},


})

listSchema.post("findOneAndDelete", async(listings)=>{
    if(listings){
        await Reviews.deleteMany({_id: { $in: listings.reviews}})
    }
    
})

const Listing = mongoose.model("Listing", listSchema);

module.exports = Listing;