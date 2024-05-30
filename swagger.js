
module.exports = (app)=>{

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerDocument = require('./swagger.json');
const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: { title: 'How to use Raouts', description: 'Wherever {variable} appears, remove the {} and add : before' },
        servers: [{ url: 'http://localhost:3000', }],
        tags: [{ name: 'Campaign', }, { name: 'Message', }, { name: 'Lead', }, { name: 'WhatsApp', }],
    },
    apis: ['./routes/*.router.js'],
};
const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
