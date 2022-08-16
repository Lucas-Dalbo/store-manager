const connection = require('./connection');

const create = async (id, sale) => {
  await connection.execute(
    'INSERT INTO StoreManager.sales_products (sale_id, product_id, quantity) VALUES (?, ?, ?);',
    [id, sale.productId, sale.quantity],
  );
};

const remove = async (id) => {
  await connection.execute(
    'DELETE FROM StoreManager.sales_products WHERE sale_id = ?;',
    [id],
  );
};

module.exports = { create, remove };
