const connection = require('./connection');

const create = async (id, sale) => {
  await connection.execute(
    'INSERT INTO StoreManager.sales_products (sale_id, product_id, quantity) VALUES (?, ?, ?);',
    [id, sale.productId, sale.quantity],
  );
};

module.exports = { create };
