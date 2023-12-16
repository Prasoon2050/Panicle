const mongoose = require("mongoose");
const { Schema } = mongoose;

const productDetailSchema = new Schema({
  productName: {
    type: String,
    required: true,
  },
  sellPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  netPrice: {
    type: Number,
    required: true,
  },
  buyPrice: {
    type: Number,
    required: true,
  },
});

const billSchema = new Schema({
  billNo: {
    type: String,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  details: [productDetailSchema],
});

const stockSchema = new Schema({
  productName: {
    type: String,
    required: true,
  },
  productQuantity: {
    type: Number,
    required: true,
  },
  costPrice: {
    type: Number,
    required: true,
  },
  sellingPrice: {
    type: Number,
    required: true,
  },
});

const adminSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  shopName: {
    type: String,
    required: true,
  },
  stock: [stockSchema],
  bills: [billSchema],
});

adminSchema.virtual("netStock").get(function () {
  const totalCostPrice = this.stock.reduce(
    (total, item) => total + item.costPrice * item.productQuantity,
    0
  );
  // Calculate netStock as the sum of cost price
  return totalCostPrice;
});

adminSchema.virtual("netSales").get(function () {
  const totalSales = this.bills.reduce(
    (total, bill) => total + bill.totalAmount,
    0
  );

  // Calculate netStock as the sum of cost price
  return totalSales;
});

adminSchema.virtual("profit").get(function () {
  const totalProfit = this.bills.reduce((total, bill) => {
    const billProfit = bill.details.reduce((billTotal, productDetail) => {
      return (
        billTotal +
        (productDetail.sellPrice - productDetail.buyPrice) *
          productDetail.quantity
      );
    }, 0);
    return total + billProfit;
  }, 0);
  return totalProfit;
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
