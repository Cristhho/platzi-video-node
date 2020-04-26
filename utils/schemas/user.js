const Joi = require('@hapi/joi');

const userIdSchema = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

const userSchema = {
    name: Joi.string().max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
};

const createUserSchema = {
    ...userSchema,
    isAdmin: Joi.boolean()
}

const createProviderUserSchema = {
    ...userSchema,
    apiKeyToken: Joi.string().required()
}

module.exports = {
    userIdSchema,
    createUserSchema,
    createProviderUserSchema
}