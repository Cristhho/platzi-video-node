const assert = require('assert');
const proxyquire = require('proxyquire');

const { MongoLibMock, getAllStub, createStub } = require('../utils/mocks/mongoLib');
const { moviesMock } = require('../utils/mocks/movies.js');

describe("services - movies", function() {
    const MovieServices = proxyquire('../service/movies', {
        '../lib/mongo': MongoLibMock
    });
    const moviesServices = new MovieServices;

    describe("when getMovies method is called", async function() {
        it("should call the getAll MongoLib method", async function() {
            await moviesServices.getMovies({});
            assert.strictEqual(getAllStub.called, true);
        });

        it("should return an array of movies", async function() {
            const result = await moviesServices.getMovies({});
            const expected = moviesMock;
            assert.deepEqual(result, expected);
        });
    });

    describe("when createMovie method is called", async function() {
        it("should call the create MongoLib method", async function() {
            await moviesServices.createMovie({});
            assert.strictEqual(createStub.called, true);
        });

        it("should return the id of the new movie", async function() {
            const result = await moviesServices.createMovie({});
            const expected = moviesMock[0].id;
            assert.deepEqual(result, expected);
        });
    });
});