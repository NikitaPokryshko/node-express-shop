const sgMail = require('@sendgrid/mail')
const keysConfig = require("../keys");

sgMail.setApiKey(keysConfig.SENDGRID_API_KEY);

module.exports = sgMail;
