const connection = require('./connection');

const create = async () => {
  const [result] = await connection.execute(
    'INSERT INTO StoreManager.sales (date) VALUE (DEFAULT);',
  );
  const id = result.insertId;

  return id;
};

module.exports = { create };
