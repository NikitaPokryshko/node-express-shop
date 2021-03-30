const {
  DB_PASSWORD,
  DB_NAME,
  DB_USER,
  DB_CLUSTER_URL,
  SESSION_SECRET,
  APP_PORT,
  SENDGRID_API_KEY
} = process.env;

const DEFAULT_APP_PORT = 3000;

module.exports = {
  MONGO_DB_URI: `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER_URL}/${DB_NAME}`,
  SESSION_SECRET,
  SENDGRID_API_KEY,
  APP_PORT: APP_PORT || DEFAULT_APP_PORT,
  EMAIL_FROM: 'pokryshko.n@gmail.com',
  BASE_URL: 'http://localhost:3000'
}
