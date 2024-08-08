const { Product, validateProduct } = require("../models/productSchema");
const Customer = require("../models/customerSchema");

const getProducts = async (req, res) => {
  try {
    let products = await Product.find().populate("seller", "shopName");
    if (products.length > 0) {
      res.send(products);
    } else {
      res.send({ message: "No products found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const productCreate = async (req, res) => {
  const { error, value } = validateProduct(req.body);
  if (error) {
    return res.status(400).json({
      status: "error",
      message: "Validation error",
      details: error.details.map((err) => err.message),
    });
  }

  try {
    console.log(req.body);

    const product = new Product(req.body);
    await product.save();
    res.status(201).json({
      status: "success",
      message: "Product added successfully",
      product,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: err.message,
    });
  }
};

const getSellerProducts = async (req, res) => {
  try {
    let products = await Product.find({ seller: req.params.id });
    if (products.length > 0) {
      res.send(products);
    } else {
      res.send({ message: "No products found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  getProducts,
  productCreate,
  getSellerProducts,
  getProductDetail,
  // updateProduct,
  // addReview,
  // searchProduct,
  // searchProductbyCategory,
  // searchProductbySubCategory,
  // deleteProduct,
  // deleteProducts,
  // deleteProductReview,
  // deleteAllProductReviews,
  // getInterestedCustomers,
  // getAddedToCartProducts,
};
