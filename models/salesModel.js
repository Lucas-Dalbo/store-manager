const connection = require('./connection');

const create = async () => {
  const [result] = await connection.execute(
    'INSERT INTO StoreManager.sales (date) VALUE (DEFAULT);',
  );
  const id = result.insertId;

  return id;
};

const getAll = async () => {
  const query = `SELECT
    sale_products.sale_id AS saleId,
    sales.date AS date,
    sale_products.product_id AS productId,
    sale_products.quantity
  FROM StoreManager.sales_products AS sale_products
  INNER JOIN StoreManager.sales AS sales
  ON sale_products.sale_id = sales.id;`;
  
  const [result] = await connection.execute(query);
  return result;
};

const findById = async (id) => {
  const query = `SELECT
    sales.date AS date,
    sale_products.product_id AS productId,
    sale_products.quantity
  FROM StoreManager.sales_products AS sale_products
  INNER JOIN StoreManager.sales AS sales
  ON sale_products.sale_id = sales.id
  WHERE sale_id = ?;`;

  const [result] = await connection.execute(query, [id]);
  return result;
};

const remove = async (id) => {
  const [result] = await connection.execute(
    'DELETE FROM StoreManager.sales WHERE id = ?;',
    [id],
  );

  return result.affectedRows;
};

module.exports = { create, getAll, findById, remove };
