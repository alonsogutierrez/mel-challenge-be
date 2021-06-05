const RemoteRestData = require('./../../shared/insfrastructure/RemoteRestData');

const baseUrl = process.env.PRODUCTS_BASE_URL_API;
const getProductsByTextURL = process.env.PRODUCTS_BY_TEXT_URL_API;
const getProductByIdURL = process.env.PRODUCT_BY_ID_URL_API;
const getProductDescriptionByIdURL =
  process.env.PRODUCT_DESCRIPTION_BY_ID_URL_API;
const AUTHOR_NAME = process.env.AUTHOR_NAME;
const AUTHOR_LASTNAME = process.env.AUTHOR_LASTNAME;

const logger = console;

const getProductsByText = async text => {
  const response = await RemoteRestData.GETRequest(
    baseUrl,
    getProductsByTextURL,
    {
      q: text
    }
  );
  if (isValidResponse(response)) {
    logger.info('Valid API response');
    const { results, paging, available_filters, filters } = response;
    delete response.results;
    if (areProductsInResponse(paging)) {
      const productsResult = results;
      const categoriesResult = getCategoriesResult(filters, available_filters);

      const ubicationAvailable = getProductsUbication(available_filters);

      return createProductsByTextResponse(
        categoriesResult,
        productsResult,
        ubicationAvailable
      );
    }
    logger.info('There is no products');
    return [];
  }
  return [];
};

const getProductById = async id => {
  const productDataResponse = await RemoteRestData.GETRequest(
    baseUrl,
    getProductByIdURL.replace(':id', id),
    {}
  );
  const productDescriptionDataResponse = await RemoteRestData.GETRequest(
    baseUrl,
    getProductDescriptionByIdURL.replace(':id', id),
    {}
  );
  if (
    productDataResponse &&
    Object.keys(productDataResponse).length > 0 &&
    productDescriptionDataResponse &&
    Object.keys(productDescriptionDataResponse).length > 0
  ) {
    return createProductByIdResponse(
      productDataResponse,
      productDescriptionDataResponse
    );
  }
  return {
    message: 'Product not found'
  };
};

const getAuthorData = () => {
  return {
    name: AUTHOR_NAME,
    lastname: AUTHOR_LASTNAME
  };
};

const getCategoriesResult = (filters, available_filters) => {
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
  return categoriesResult;
};

const getProductsUbication = available_filters => {
  const ubications = available_filters.find(filter => filter.id === 'state');
  const ubicationAvailable = ubications.values.sort(
    (a, b) => a.results > b.results
  )[0];
  return ubicationAvailable;
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

const createProductsByTextResponse = (categories, products, ubication) => {
  const response = {
    author: getAuthorData(),
    categories: categories,
    items: getProductsInfo(products),
    ubication: ubication.name
  };
  return response;
};

const createProductByIdResponse = (product, description) => {
  const {
    id,
    title,
    currency_id,
    price,
    pictures,
    condition,
    shipping,
    sold_quantity
  } = product;
  return {
    author: getAuthorData(),
    item: {
      id: id,
      title: title,
      price: {
        currency: currency_id,
        amount: price,
        decimals: 0
      },
      picture: pictures[0].url,
      condition: condition,
      free_shipping: shipping.free_shipping,
      sold_quantity: sold_quantity,
      description: description.plain_text
    }
  };
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
  getProductsByText,
  getProductById
};
