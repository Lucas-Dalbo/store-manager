const { expect } = require('chai');
const sinon = require('sinon');
const productService = require('../../../services/productService');
const productController = require('../../../controllers/productController');

describe('Testes de productModel', () => {
  describe('Quando realizar uma busca por todos os produtos', () => {
    describe('Se a requisição for um sucesso', () => {
      const expectedReturn = [
        { id: 1, name: 'Martelo de Thor' },
        { id: 2, name: 'Traje de encolhimento' },
      ];

      const response = {};
      const request = {};

      before(() => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(productService, 'getAll').resolves(expectedReturn);
      })

      after(async () => {
        productService.getAll.restore();
      });

      it('status é chamado com o código 200', async () => {
        await productController.getAll(request, response);
        expect(response.status.calledWith(200)).to.be.equal(true);
      })

      it('json é chamado com a array encontrada', async () => {
        await productController.getAll(request, response);
        expect(response.json.calledWith(expectedReturn)).to.be.equal(true);
      })
    })
  });
});