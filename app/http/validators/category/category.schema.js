const Joi = require("joi");
const createHttpError = require("http-errors");

const addCategorySchema = Joi.object({
  title: Joi.string()
    .required()
    .min(3)
    .max(100)
    .error(createHttpError.BadRequest("Invalid category title ")),
  englishTitle: Joi.string()
    .required()
    .min(3)
    .max(100)
    .error(
      createHttpError.BadRequest("Invalid category title ")
    ),
  description: Joi.string()
    .required()
    .min(3)
    .max(200)
    .error(createHttpError.BadRequest("Invalid category description")),
});

const updateCategorySchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .error(createHttpError.BadRequest("Invalid category title")),
  englishTitle: Joi.string()
    .min(3)
    .max(100)
    .error(
      createHttpError.BadRequest("Invalid category title")
    ),
  description: Joi.string()
    .required()
    .min(3)
    .max(200)
    .error(createHttpError.BadRequest("Invalid category description")),
});

module.exports = {
  addCategorySchema,
  updateCategorySchema,
};
