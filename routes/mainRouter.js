const express = require('express');
const mainRouter = express.Router();

const campaignRouter = require('./campaign.router');
const leadRouter = require('./lead.router');
const msgRouter = require('./msg.router');
const userRouter = require("./user.router");
const loginRouter = require("./login.router");
const webhookRouter = require("./webhook.router")
const paymentRouter = require("./payment.router")
const accountRouter = require('./account.router');
const adminRouter = require('./admin.router');
const apiRouter = require('./api.router');
const fileRouter = require('./file.router');
const whatsAppArouter = require('./whatsApp.router');
const feedbackRouter = require('./feedback.router');
const plansRouter = require('./plans.router')


mainRouter.use('/campaign', campaignRouter);
mainRouter.use('/campaign', msgRouter);
mainRouter.use('/campaign', leadRouter);
mainRouter.use('/user', userRouter);
mainRouter.use('/login', loginRouter);
mainRouter.use('/webhook', webhookRouter)
mainRouter.use('/payment', paymentRouter);
mainRouter.use('/accout', accountRouter);
mainRouter.use('/admin', adminRouter)
mainRouter.use('/api', apiRouter)
mainRouter.use('/files', fileRouter)
mainRouter.use('/whatsapp', whatsAppArouter)
mainRouter.use('/feedback', feedbackRouter)
mainRouter.use('/plans', plansRouter);

module.exports = mainRouter