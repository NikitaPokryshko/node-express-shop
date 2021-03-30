const {
  DB_PASSWORD,
  DB_NAME,
  DB_USER,
  DB_CLUSTER_URL,
  SESSION_SECRET,
  SENDGRID_API_KEY,
  APP_PORT,
  EMAIL_FROM,
  BASE_URL,
} = process.env;

module.exports = {
  MONGO_DB_URI: `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_CLUSTER_URL}/${DB_NAME}`,
  SESSION_SECRET,
  SENDGRID_API_KEY,
  APP_PORT,
  EMAIL_FROM,
  BASE_URL,
}
