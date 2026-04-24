const Joi = require('joi');

const saveScript = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  language: Joi.string().valid('python', 'cpp', 'javascript', 'sql').required(),
  code: Joi.string().max(1048576).required(),
});

const executeCode = Joi.object({
  language: Joi.string().valid('python', 'cpp', 'javascript', 'sql').required(),
  code: Joi.string().max(1048576).required(),
  stdin: Joi.string().max(65536).allow(''),
});

const authUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports = { saveScript, executeCode, authUser };