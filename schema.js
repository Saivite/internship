const Joi = require("joi");

const allJobSchema = Joi.object({
  AllJob: Joi.object({
    position: Joi.string().required(),
    businessHR: Joi.string().required(),
    openingDate: Joi.date().required(),
    closingDate: Joi.date().required(),
    payment: Joi.number().min(0),
    description: Joi.string().required(),
    eligibility: Joi.string().required(),
    location: Joi.string().required(),
    skills: Joi.string().required(),
    experience: Joi.string().required(),
  }).required(),
});

const jobDataSchema = Joi.object({
  jobData: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({ tlds: { allow: false } }),
    address: Joi.string().required(),
    currentPosition: Joi.string().required(),
    location: Joi.string().required(),
    gender: Joi.string().required(),
    mobile: Joi.number().required(),
  }).required(),
});

module.exports = { allJobSchema, jobDataSchema };
