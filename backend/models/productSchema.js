const mongoose = require("mongoose");
const Joi = require("joi");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
    },
    price: {
      mrp: {
        type: Number,
      },
      cost: {
        type: Number,
      },
      discountPercent: {
        type: Number,
      },
    },
    subcategory: {
      type: String,
    },
    productImage: {
      type: String,
    },
    category: {
      type: String,
    },
    description: {
      type: String,
    },
    tagline: {
      type: String,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    reviews: [
      {
        rating: {
          type: Number,
        },
        comment: {
          type: String,
        },
        reviewer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "customer",
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "seller",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("product", productSchema);

const validateProduct = (product) => {
  const schema = Joi.object({
    productName: Joi.string().required().messages({
      "string.empty": "Product name is required",
      "any.required": "Product name is required",
    }),
    price: Joi.object({
      mrp: Joi.number().required().messages({
        "number.base": "MRP must be a number",
        "any.required": "MRP is required",
      }),
      cost: Joi.number().required().messages({
        "number.base": "Cost must be a number",
        "any.required": "Cost is required",
      }),
      discountPercent: Joi.number().required().messages({
        "number.base": "Discount percent must be a number",
        "any.required": "Discount percent is required",
      }),
    }).required(),
    subcategory: Joi.string().required().messages({
      "string.empty": "Subcategory is required",
      "any.required": "Subcategory is required",
    }),
    productImage: Joi.string().uri().required().messages({
      "string.empty": "Product image URL is required",
      "any.required": "Product image URL is required",
      "string.uri": "Product image URL must be a valid URI",
    }),
    category: Joi.string().required().messages({
      "string.empty": "Category is required",
      "any.required": "Category is required",
    }),
    description: Joi.string().required().messages({
      "string.empty": "Description is required",
      "any.required": "Description is required",
    }),
    tagline: Joi.string().required().messages({
      "string.empty": "Tagline is required",
      "any.required": "Tagline is required",
    }),
    quantity: Joi.number().default(1).messages({
      "number.base": "Quantity must be a number",
    }),
    reviews: Joi.array().items(
      Joi.object({
        rating: Joi.number().required().messages({
          "number.base": "Rating must be a number",
          "any.required": "Rating is required",
        }),
        comment: Joi.string().required().messages({
          "string.empty": "Comment is required",
          "any.required": "Comment is required",
        }),
        reviewer: Joi.string().required().messages({
          "string.empty": "Reviewer ID is required",
          "any.required": "Reviewer ID is required",
        }),
        date: Joi.date().default(Date.now),
      })
    ),
    seller: Joi.string().required().messages({
      "string.empty": "Seller ID is required",
      "any.required": "Seller ID is required",
    }),
  });

  return schema.validate(product, { abortEarly: false });
};
module.exports = {
  Product,
  validateProduct,
};
