const AUTHOR_NAME = process.env.AUTHOR_NAME;
const AUTHOR_LASTNAME = process.env.AUTHOR_LASTNAME;
const SIGN_SECRET = AUTHOR_NAME + ' ' + AUTHOR_LASTNAME;

const isValidRequest = (req, res, next) => {
  try {
    const headerSignData = req.header('sign');
    const sign = headerSignData.replace('Sign ', '');

    if (sign !== SIGN_SECRET) {
      throw new Error('Wrong sign');
    }
    next();
  } catch (e) {
    res.status(401).send({ error: `Please sign your request: ${e.messsage}` });
  }
};

module.exports = { isValidRequest };
