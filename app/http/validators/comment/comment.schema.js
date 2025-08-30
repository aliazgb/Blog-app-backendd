const Joi = require("joi");
const createHttpError = require("http-errors");
const { MongoIDPattern } = require("../../../utils/constants");

const contentSchema = Joi.object().keys({
  text: Joi.string()
    .min(1)
    .max(2000)
    .required()
    .error(createHttpError.BadRequest("Please enter a valid comment text")),
});

const addNewCommentSchema = Joi.object({
  content: contentSchema,
  postId: Joi.string()
    .allow()
    .pattern(MongoIDPattern)
    .error(createHttpError.BadRequest("Please enter a valid post ID")),
});

module.exports = {
  addNewCommentSchema,
};
