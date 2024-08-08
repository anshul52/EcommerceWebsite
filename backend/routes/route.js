const router = require("express").Router();

const {
  customerRegister,
  customerLogIn,
} = require("../controllers/customerController");
const {
  getProducts,
  productCreate,
  getSellerProducts,
} = require("../controllers/productController");
const {
  sellerRegister,
  sellerLogIn,
} = require("../controllers/sellerController");
const checkauth = require("../middlewares/checkauth");
const API_VERSION = process.env.API_VERSION;

// Customer
router.post(API_VERSION + "/CustomerRegister", customerRegister);
router.post(API_VERSION + "/CustomerLogin", customerLogIn);
// router.get(API_VERSION + "/getCartDetail/:id", getCartDetail);
// router.put(API_VERSION + "/CustomerUpdate/:id", cartUpdate);

// ....................Seller.........................
router.post(API_VERSION + "/SellerRegister", sellerRegister);
router.post(API_VERSION + "/SellerLogin", sellerLogIn);

// .................Product............................
router.post(API_VERSION + "/ProductCreate", productCreate);
router.get(API_VERSION + "/getSellerProducts/:id", getSellerProducts);
router.get(API_VERSION + "/getProducts", getProducts);
router.get(API_VERSION + "/getProductDetail/:id", getProductDetail);
// router.get('/getInterestedCustomers/:id', getInterestedCustomers);
// router.get('/getAddedToCartProducts/:id', getAddedToCartProducts);

// router.put('/ProductUpdate/:id', updateProduct);
// router.put('/addReview/:id', addReview);

// router.get('/searchProduct/:key', searchProduct);
// router.get('/searchProductbyCategory/:key', searchProductbyCategory);
// router.get('/searchProductbySubCategory/:key', searchProductbySubCategory);

// router.delete('/DeleteProduct/:id', deleteProduct);
// router.delete('/DeleteProducts/:id', deleteProducts);
// router.put('/deleteProductReview/:id', deleteProductReview);
// router.delete('/deleteAllProductReviews/:id', deleteAllProductReviews);

module.exports = router;
