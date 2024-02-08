require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PORT = process.env.port || 2500
const campaignRouter = require('./routes/campaign.router');
const leadRouter = require('./routes/lead.router');
const userRouter = require("./routes/user.router");
const db = require('./DL/db')

const app = express();
db.connect();

app.use(cors());
app.use(express.json());

app.use('/campaign', campaignRouter);
app.use('/lead', leadRouter);
app.use('/user', userRouter)


const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerDocument = require('./swagger.json');

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: { title: 'How to use Raouts' },
        servers: [{ url: 'http://localhost:3000', }],
        tags: [{ name: 'Campaign', }, { name: 'Message', }, { name: 'Lead', },],
    },
    apis: ['./routes/*.router.js'],
};


const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => console.log(`****server is listening on ${PORT}****`))