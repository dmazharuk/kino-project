require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const { removeXPoweredBy } = require('./middlewares/common');

const tokenRouter = require('./routes/token.router');
const authRouter = require('./routes/auth.router');

const viewRouter = require('./routes/view.router');
const adviceRouter = require('./routes/advice.router');
const wishRouter = require('./routes/wish.router');
const lookRouter = require('./routes/look.router');

const userRouter = require('./routes/user.router');
const friendRouter = require('./routes/friend.router');

const app = express();

const { PORT } = process.env;

const corsConfig = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174'],
  credentials: true,
};

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(removeXPoweredBy);

app.use(cors(corsConfig));

app.use('/api/v1.0/auth', authRouter);
app.use('/api/v1.0/tokens', tokenRouter);
app.use('/api/v1.0/view', viewRouter);
app.use('/api/v1.0/advice', adviceRouter);
app.use('/api/v1.0/wish', wishRouter);
app.use('/api/v1.0/look', lookRouter);

app.use('/api/v1.0/user', userRouter);
app.use('/api/v1.0/friends', friendRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}!`);
});
