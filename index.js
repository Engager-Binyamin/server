require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PORT = 2500
const campaignRouter = require('./routes/campaign.router');
const leadRouter = require('./routes/lead.router');
const msgRouter = require('./routes/msg.router');
const userRouter = require("./routes/user.router");
const loginRouter = require("./routes/login.router");
const webhookRouter = require("./routes/webhook.router")
const paymentRouter = require("./routes/payment.router")
const accountRouter = require('./routes/account.router');
const adminRouter = require('./routes/admin.router');
const apiRouter = require ('./routes/api.router');
const fileRouter = require( './routes/file.router');
const whatsAppArouter = require('./routes/whatsApp.router');

const db = require('./DL/db')

const app = express();
db.connect();

app.use(cors());
app.use(express.json());
app.use(express.static('public'))



app.use('/campaign', campaignRouter);
app.use('/campaign', msgRouter);
app.use('/campaign', leadRouter);
app.use('/user', userRouter);
app.use('/login', loginRouter);
app.use('/webhook', webhookRouter)
app.use('/payment', paymentRouter);
app.use('/accout' , accountRouter);
app.use('/admin' , adminRouter)
app.use('/api' , apiRouter)
app.use('/files' , fileRouter)
app.use('/whatsapp' , whatsAppArouter)

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerDocument = require('./swagger.json');

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: { title: 'How to use Raouts', description: 'Wherever {variable} appears, remove the {} and add : before' },
        servers: [{ url: 'http://localhost:3000', }],
        tags: [{ name: 'Campaign', }, { name: 'Message', }, { name: 'Lead', },{ name: 'WhatsApp', }],
    },
    apis: ['./routes/*.router.js'],
};


const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => console.log(`****server is listening on ${PORT}****`))