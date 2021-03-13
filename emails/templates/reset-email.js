const keysConfig = require('../../keys');

function getResetEmail(email, token) {
  return {
    to: email,
    from: keysConfig.EMAIL_FROM,
    subject: 'Access recovery',
    text: 'forgot password?',
    html: `
      <h1>Forgot password for ${email}?</h1>
      <p>If not, you should ignore this message</p>
      <p>Else, follow the link to change your password </p>
      <p><a href="${keysConfig.BASE_URL}/auth/password/${token}">Restore access</a></p>
      <hr />
      <a href="${keysConfig.BASE_URL}">Go to Courses Shop</a>
    `,
  }
}

module.exports = getResetEmail;
