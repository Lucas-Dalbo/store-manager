const { expect } = require('chai');
const sinon = require('sinon');
const connection = require('../../../models/connection');
const salesProductsModel = require('../../../models/salesProductsModel');

describe('Testes de salesProductsModel', () => {
  describe('Ao cadastrar itens de uma venda', () => {
    describe('Com sucesso', () => {
      const testSaleId = 1
      const testSale = { productId: 1, quantity: 1 };

      before(() => {
        sinon.stub(connection, 'execute').resolves();
      });

      after(() => {
        connection.execute.restore();
      });

      it('Execute é chamado com os parametros corretos', async () => {
        await salesProductsModel.create(testSaleId, testSale);
        
        expect(connection.execute.calledWith(
          'INSERT INTO StoreManager.sales_products (sale_id, product_id, quantity) VALUES (?, ?, ?);',
          [testSaleId, testSale.productId, testSale.quantity],
        )).to.be.true;
      });
    });
  });

  describe('Ao deletar os itens de uma venda', () => {
    describe('Com sucesso', () => {
      const testSaleId = 1

      before(() => {
        sinon.stub(connection, 'execute').resolves();
      });

      after(() => {
        connection.execute.restore();
      });

      it('Execute é chamado com os parametros corretos', async () => {
        await salesProductsModel.remove(testSaleId);

        expect(connection.execute.calledWith(
          'DELETE FROM StoreManager.sales_products WHERE sale_id = ?;',
          [testSaleId],
        )).to.be.true;
      });
    });
  });
});