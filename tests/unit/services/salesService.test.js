const { expect } = require('chai');
const sinon = require('sinon');
const productModel = require('../../../models/productModel');
const salesModel = require('../../../models/salesModel');
const salesProductsModel = require('../../../models/salesProductsModel');
const salesService = require('../../../services/salesService');

describe('Testes de salesService', () => {
  describe('Quando um novo produto é adicionado', () => {
    describe('Se o id for inválido', () => {
      const testSale = [{ productId: 80, quantity: 1 }]
      const expectedReturn = [
        { id: 1, name: 'Martelo de Thor' },
        { id: 2, name: 'Traje de encolhimento' },
      ];

      before(() => {
        sinon.stub(salesService, 'isProductValid').resolves(false);
        sinon.stub(productModel, 'getAll').resolves(expectedReturn);
      });

      after(() => {
        salesService.isProductValid.restore();
        productModel.getAll.restore();
      });

      it('retorna um objeto', async () => {
        const result = await salesService.create(testSale);
        expect(result).to.be.an('object');
      });

      it('o objeto contem uma mensagem de produto inexistente', async () => {
        const result = await salesService.create(testSale);
        expect(result).to.deep.equals({ message: 'Product not found' });
      });
    });

    describe('Se o id for valido', () => {
      const testSale = [{ productId: 1, quantity: 1 }]
      const testSaleId = 1;
      const expectedReturn = [
        { id: 1, name: 'Martelo de Thor' },
        { id: 2, name: 'Traje de encolhimento' },
      ];

      before(() => {
        sinon.stub(salesService, 'isProductValid').resolves(true);
        sinon.stub(productModel, 'getAll').resolves(expectedReturn);
        sinon.stub(salesModel, 'create').resolves(testSaleId);
      });

      after(() => {
        salesService.isProductValid.restore();
        productModel.getAll.restore();
        salesModel.create.restore();
      });

      it('retorna um objeto', async () => {
        const result = await salesService.create(testSale);
        expect(result).to.be.an('object');
      });

      it('o objeto contem o id da venda e os produtos', async () => {
        const result = await salesService.create(testSale);
        const testReturn = { id: testSaleId, itemsSold: [...testSale] };
        expect(result).to.deep.equals(testReturn);
      });
    });
  });
});