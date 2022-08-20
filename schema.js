const Joi = require("joi");

const allJobSchema = Joi.object({
  AllJob: Joi.object({
    title: Joi.string().required(),
    payment: Joi.number().min(0),
    description: Joi.string().required(),
    eligible: Joi.string().required(),
    location: Joi.string().required(),
    skills: Joi.string().required(),
    experience: Joi.string().required(),
  }).required(),
});

module.exports = { allJobSchema };
