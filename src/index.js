require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');
const services = require('./services');
const di = require('./middlewares/di-middleware');
const errors = require('./middlewares/error-middleware');
const accessToken = require('./middlewares/access-token-middleware');
const auth = require('./middlewares/auth-middleware');
const roles = require('./middlewares/roles-middleware');
const selfAdmin = require('./middlewares/self-admin-middleware');

const createJogRoutes = require('./routes/jog-routes');
const createUserRoutes = require('./routes/user-routes');
const createSessionRoutes = require('./routes/session-routes');
const createRegistrationRoutes = require('./routes/registration-routes');



const app = new Koa();
const router = new Router();

app
  .use(bodyParser())
  .use(cors())
  .use(di(services))
  .use(errors())
  .use(createSessionRoutes('/sessions', { accessToken }).routes())
  .use(createRegistrationRoutes('/registrations').routes())
  .use(createJogRoutes('/users/:userId/jogs').routes())
  .use(createUserRoutes('/users', { accessToken, auth, roles, selfAdmin }).routes())
  .use(router.allowedMethods())
  .listen(process.env.PORT);
