const keysConfig = require('../../keys');

function getRegistrationEmail(email) {
  return {
    to: email,
    from: keysConfig.EMAIL_FROM,
    subject: 'Account successfully created',
    text: 'and ready for work',
    html: `
      <h1>Welcome to our Courses Shop!</h1>
      <p>You have successfully created an account for email: ${email}</p>
      <hr />
      <a href="${keysConfig.BASE_URL}">Go to Courses Shop</a>
    `,
  }
}

module.exports = getRegistrationEmail;
