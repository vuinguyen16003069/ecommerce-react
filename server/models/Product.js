const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: String,
  image: String,
  images: [String],
  rating: { type: Number, default: 5 },
  sold: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  desc: String,
  reviews: [
    {
      user: String,
      rating: Number,
      text: String,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  isFlashSale: { type: Boolean, default: false },
  flashSaleDiscount: { type: Number, default: 0 },
  flashSaleStartTime: Date,
  flashSaleEndTime: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
