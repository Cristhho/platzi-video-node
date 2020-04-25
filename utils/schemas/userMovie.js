const Joi = require('@hapi/joi');

const {movieIdSchema} = require('./movie');
const {userIdSchema} = require('./user');

const userMovieIdSchema = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

const createUserMovieSchema = {
    userId: userIdSchema,
    movieId: movieIdSchema
};

module.exports = {
    userMovieIdSchema,
    createUserMovieSchema
}