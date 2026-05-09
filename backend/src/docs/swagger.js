import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Movie Browsing API',
      version: '1.0.0',
      description: 'REST API for browsing and managing movies.',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Movie: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 550 },
            tmdbId: { type: 'integer', example: 550 },
            title: { type: 'string', example: 'Fight Club' },
            overview: { type: 'string' },
            posterUrl: { type: 'string', nullable: true },
            backdropUrl: { type: 'string', nullable: true },
            releaseYear: { type: 'integer', nullable: true, example: 1999 },
            genre: { type: 'array', items: { oneOf: [{ type: 'string' }, { type: 'integer' }] } },
            director: { type: 'string', nullable: true },
            cast: { type: 'array', items: { type: 'string' } },
            runtime: { type: 'integer', nullable: true },
            rating: { type: 'number', nullable: true, example: 8.4 },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 20 },
            total: { type: 'integer', example: 35156 },
            pages: { type: 'integer', example: 1758 },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Not authorized' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

export default function swaggerDocs(app) {
  const specs = swaggerJSDoc(options);
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));
}
