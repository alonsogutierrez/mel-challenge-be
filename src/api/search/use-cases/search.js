const RemoteRestData = require('./../../shared/insfrastructure/RemoteRestData');

const baseUrl = process.env.PRODUCTS_BASE_URL_API;
const getProductsByTextURL = process.env.PRODUCTS_BY_TEXT_URL_API;

const logger = console;

const getProductsByText = async text => {
  const response = await RemoteRestData.GETRequest(
    baseUrl,
    getProductsByTextURL,
    text
  );
  if (isValidResponse(response)) {
    logger.info('Valid response');
    const { results, paging, available_filters } = response;
    delete response.results;
    logger.info('Response: ', JSON.stringify(response));
    if (areProductsInResponse(paging)) {
      logger.info('Existen productos');
      const productsResult = results;
      const categoriesResult = available_filters[0].values;
      const author = {
        name: 'Alonso',
        lastname: 'Gutierrez'
      };
      const response = createResponse(categoriesResult, productsResult, author);
      return response;
    }
    logger.info('No hay productos');
    return [];
  }
  return [];
};

const isValidResponse = response => {
  const { paging, results } = response;
  const isValid = Object.keys(response).length > 0 && paging && results;
  return isValid;
};

const areProductsInResponse = paging => {
  const { total } = paging;
  return total > 0 ? true : false;
};

const createResponse = (categories, products, author) => {
  const response = {
    author: {
      name: author.name,
      lastname: author.lastname
    },
    categories: getProductCategories(categories),
    items: getProductsInfo(products)
  };
  return response;
};

const getProductCategories = categories => {
  let productCategories = [];
  categories.forEach(category => {
    const { name } = category;
    productCategories.push(name);
  });
  return productCategories;
};

const getProductsInfo = products => {
  return products.slice(0, 4).map(product => {
    const {
      id,
      title,
      price,
      condition,
      currency_id,
      thumbnail,
      shipping: { free_shipping }
    } = product;
    return {
      id,
      title,
      price: {
        currency: currency_id,
        amount: price,
        decimals: 0
      },
      picture: thumbnail,
      condition,
      free_shipping
    };
  });
};

module.exports = {
  getProductsByText
};
