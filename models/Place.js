const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProductSchema = new Schema(
    {
      name: {
        type: String,
        required: [true, "Please add a name"],
      },
      description: {
        type: String,
        required: [true, "Please add a description"],
      },
      city:{
        type:String,
        required:[true,"Please add a city"]
      },
      images: [
        {
          type: String,
          required: [true, "Please add an image"],
          default: "default.jpg"
        }
      ],
      user: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: "User",
      },
    },
    {
      timestamps: true,
      toJSON: { virtuals: true },
    }
  );
  
const Product = mongoose.model("Product", ProductSchema);
module.exports = Product