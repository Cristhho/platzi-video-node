const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');

const ApiKeyService = require('../service/apiKeys');
const UsersService = require('../service/users');
const validationHandler = require('../utils/middleware/validationHandler');
const {
  createUserSchema,
  createProviderUserSchema,
} = require('../utils/schemas/user');
const { config } = require('../config');

require('../utils/auth/strategies/basic');

function authApi(app) {
  const router = express.Router();
  app.use('/api/auth', router);

  const apiKeyService = new ApiKeyService();
  const usersService = new UsersService();

  router.post('/sign-in', async (req, res, next) => {
    const { apikeyToken } = req.body;
    if (!apikeyToken) next(boom.unauthorized('apiKeyToken is required'));

    passport.authenticate('basic', (error, user) => {
      try {
        if (error || !user) next(boom.unauthorized());

        req.login(user, { session: false }, async (err) => {
          if (err) next(err);

          const apiKey = await apiKeyService.getApiKey({ token: apikeyToken });
          if (!apiKey) next(boom.unauthorized());

          const { _id: id, name, email } = user;

          const payload = {
            sub: id,
            name,
            email,
            scopes: apiKey.scopes,
          };
          const token = jwt.sign(payload, config.authJwtSecret, {
            expiresIn: '15m',
          });

          return res.status(200).json({
            token,
            user: { id, name, email },
          });
        });
      } catch (err) {
        next(err);
      }
    })(req, res, next);
  });

  router.post(
    '/sign-up',
    validationHandler(createUserSchema),
    async (req, res, next) => {
      const { body: user } = req;

      try {
        const createdUserId = await usersService.createUser({ user });

        res.status(201).json({ data: createdUserId, message: 'user created' });
      } catch (error) {
        next(error);
      }
    }
  );

  router.post(
    '/sign-provider',
    validationHandler(createProviderUserSchema),
    async (req, res, next) => {
      const { body } = req;
      const { apiKeyToken, ...user } = body;

      if (!apiKeyToken) next(boom.unauthorized('apiKeyToken is required'));

      try {
        const queriedUser = await usersService.getOrCreateUser({ user });
        const apiKey = await apiKeyService.getApiKey({ token: apiKeyToken });

        if (!apiKey) next(boom.unauthorized());

        const { _id: id, name, email } = queriedUser;
        const payload = {
          sub: id,
          name,
          email,
          scopes: apiKey.scopes,
        };

        const token = jwt.sign(payload, config.authJwtSecret, {
          expiresIn: '15m',
        });

        res.status(200).json({ token, user: { id, name, email } });
      } catch (error) {
        next(error);
      }
    }
  );
}

module.exports = authApi;
