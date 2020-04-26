const express = require('express');
const passport = require('passport');

const MovieService = require('../service/movies');
const {
  movieIdSchema,
  createMovieSchema,
  updateMovieSchema,
} = require('../utils/schemas/movie');
const validationHandler = require('../utils/middleware/validationHandler');
const scopesValidationHandler = require('../utils/middleware/scopesValidationHandler');
const cacheResponse = require('../utils/cacheResponse');
const {
  FIVE_MINUTES_IN_SECONDS,
  SIXTY_MINUTES_IN_SECONDS,
} = require('../utils/time');

// JWT Strategy
require('../utils/auth/strategies/jwt');

function moviesApi(app) {
  const router = express.Router();
  app.use('/api/movies', router);

  const movieService = new MovieService();

  router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:movies']),
    async (req, res, next) => {
      cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
      const { tags } = req.query;

      try {
        const movies = await movieService.getMovies({ tags });

        res.status(200).json({
          data: movies,
          message: 'movies listed',
        });
      } catch (err) {
        next(err);
      }
    }
  );
  router.get(
    '/:movieId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:movies']),
    validationHandler({ movieId: movieIdSchema }, 'params'),
    async (req, res, next) => {
      cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);
      const { movieId } = req.params;

      try {
        const movies = await movieService.getMovie({ movieId });

        res.status(200).json({
          data: movies,
          message: 'movie retrieve',
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['create:movies']),
    validationHandler(createMovieSchema),
    async (req, res, next) => {
      const { body: movie } = req;

      try {
        const createMovieId = await movieService.createMovie({ movie });

        res.status(201).json({
          data: createMovieId,
          message: 'movie created',
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.put(
    '/:movieId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['update:movies']),
    validationHandler({ movieId: movieIdSchema }, 'params'),
    validationHandler(updateMovieSchema),
    async (req, res, next) => {
      const { body: movie } = req;
      const { movieId } = req.params;

      try {
        const updatedMovieId = await movieService.updateMovie({
          movieId,
          movie,
        });

        res.status(200).json({
          data: updatedMovieId,
          message: 'movie updated',
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router.delete(
    '/:movieId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['delete:movies']),
    validationHandler({ movieId: movieIdSchema }, 'params'),
    async (req, res, next) => {
      const { movieId } = req.params;

      try {
        const deletedMovieId = await movieService.deleteMovie({ movieId });

        res.status(200).json({
          data: deletedMovieId,
          message: 'movie deleted',
        });
      } catch (err) {
        next(err);
      }
    }
  );
}

module.exports = moviesApi;
