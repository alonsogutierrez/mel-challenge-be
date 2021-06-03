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
    const { results, paging, available_filters, filters } = response;
    delete response.results;
    logger.info('Response: ', JSON.stringify(response));
    if (areProductsInResponse(paging)) {
      logger.info('Existen productos');
      const productsResult = results;
      let categoriesResult = [];
      let categoryFilter = filters.find(filter => filter.id === 'category');
      if (!categoryFilter) {
        const categoriesAvailables = available_filters.find(
          filter => filter.id === 'category'
        );
        categoriesResult = categoriesAvailables.values
          .map(category => category.name)
          .sort((a, b) => a.results > b.results)
          .slice(0, 4);
      } else {
        categoryFilter.values.forEach(value => {
          value.path_from_root.forEach(filter =>
            categoriesResult.push(filter.name)
          );
        });
      }

      const ubications = available_filters.find(
        filter => filter.id === 'state'
      );
      const ubicationAvailable = ubications.values.sort(
        (a, b) => a.results > b.results
      )[0];

      const author = {
        name: 'Alonso',
        lastname: 'Gutierrez'
      };
      const response = createResponse(
        categoriesResult,
        productsResult,
        author,
        ubicationAvailable
      );
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

const createResponse = (categories, products, author, ubication) => {
  const response = {
    author: {
      name: author.name,
      lastname: author.lastname
    },
    categories: categories,
    items: getProductsInfo(products),
    ubication: ubication.name
  };
  return response;
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
