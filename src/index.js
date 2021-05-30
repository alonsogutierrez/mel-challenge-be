const app = require('./app');

const logger = console;
const PORT = 3000;

app.listen(PORT, () => {
  logger.info(`Server is up on port ${PORT}`);
});
