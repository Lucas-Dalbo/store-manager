const { expect } = require('chai');
const sinon = require('sinon');
const productModel = require('../../../models/productModel');
const productService = require('../../../services/productService');

describe('Testes de productModel', () => {
  describe('Quando realizar uma busca por todos os produtos', () => {
    describe('Se a requisição for um sucesso', () => {
      const expectedReturn = [
        { id: 1, name: 'Martelo de Thor' },
        { id: 2, name: 'Traje de encolhimento' },
      ];

      before(() => {
        sinon.stub(productModel, 'getAll').resolves(expectedReturn);
      })

      after(async () => {
        productModel.getAll.restore();
      });

      it('O retorno é um array', async () => {
        const resultado = await productService.getAll();
        expect(resultado).to.be.an('array');
      })

      it('Os elementos da array são objetos', async () => {
        const resultado = await productService.getAll();
        expect(resultado).to.be.equal(expectedReturn);
      })
    })
  });
});
