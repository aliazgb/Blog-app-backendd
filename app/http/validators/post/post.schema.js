const Joi = require("joi");
const createHttpError = require("http-errors");
const { MongoIDPattern } = require("../../../utils/constants");

async function validateAddNewPost(data) {
  const addNewPostSchema = Joi.object({
    title: Joi.string()
      .min(5)
      .max(100)
      .required()
      .error(createHttpError.BadRequest("Please enter a valid post title")),
    slug: Joi.string()
      .required()
      .error(createHttpError.BadRequest("Please enter a valid post slug")),
    category: Joi.string()
      .required()
      .pattern(MongoIDPattern)
      .error(createHttpError.BadRequest("Please enter a valid category ID")),
    text: Joi.string()
      .required()
      .error(createHttpError.BadRequest("Please enter a valid post content")),
    briefText: Joi.string()
      .required()
      .error(createHttpError.BadRequest("Please enter a valid post summary")),
    readingTime: Joi.number()
      .required()
      .error(createHttpError.BadRequest("Please enter a valid reading time")),
    type: Joi.string()
      .regex(/(free|premium)/i)
      .error(createHttpError.BadRequest("Post type is invalid")),
    related: Joi.array()
      .items(Joi.string().pattern(MongoIDPattern))
      .error(createHttpError.BadRequest("Related posts are invalid")),
    tags: Joi.array()
      .items(Joi.string())
      .error(createHttpError.BadRequest("Post tags are invalid")),
  });
  return addNewPostSchema.validateAsync(data);
}

module.exports = {
  validateAddNewPost,
};
