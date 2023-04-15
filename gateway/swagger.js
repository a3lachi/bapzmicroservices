const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BapzEndExpress',
      version: '1.0.0',
      description: 'Express API'
    },
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ]
  },
  apis: ['./*.js'] // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = function(app) {
  app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(specs));
};
