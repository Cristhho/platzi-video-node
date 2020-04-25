const assert = require('assert');
const proxyquire = require('proxyquire');

const { moviesMock, MoviesServiceMock } = require('../utils/mocks/movies.js');
const testServer = require('../utils/testServer');

describe('routes - movies', function () {
  const route = proxyquire('../routes/movies', {
    '../service/movies': MoviesServiceMock,
  });

  const request = testServer(route);
  describe('GET /movies', function () {
    it('should respond with status 200', function (done) {
      request.get('/api/movies').expect(200, done);
    });

    it('should respond with the list of movies', function (done) {
      request.get('/api/movies').end((err, res) => {
        assert.deepEqual(res.body, {
          data: moviesMock,
          message: 'movies listed',
        });

        done();
      });
    });
  });

  describe('POST /movies', function() {
    it('should respond with status 201', function (done) {
      request.post('/api/movies').expect(201, done);
    });

    it("should return the id of the new movie", function(done) {
      request.post('/api/movies').end((err, res) => {
        assert.deepEqual(res.body, {
          data: moviesMock[0].id,
          message: 'movie created'
        })
      });

      done();
    });
  });
});
