import * as process from 'process';
export default () => ({
  port: process.env.PORT,
  db_host: process.env.DATABASE_HOST,
  db_port: process.env.DATABASE_PORT,
  db_user: process.env.DATABASE_USER,
  db_password: process.env.DATABASE_PASSWORD,
  db_name: process.env.DATABASE_NAME,
  u_kassa_secret: process.env.U_KASSA_SECRET_KEY,
  u_kassa_username: process.env.U_KASSA_USERNAME,
  session_secret: process.env.SESSION_SECRET,
  secret_jwt: process.env.SECRET_JWT,
  expired_jwt: process.env.EXPIRED_JWT,
  base_url: process.env.BASE_URL,
  secret_cookie: process.env.SECRET_COOKIE,
});
