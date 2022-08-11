const { expect } = require('chai');
const sinon = require('sinon');
const connection = require('../../../models/connection');
const productModel = require('../../../models/productModel');

describe('Testes de productModel', () => {
  describe('Quando realizar uma busca por todos os produtos', () => {
    describe('Se a requisição for um sucesso', () => {
      const expectedReturn = [[
        { id: 1, name: 'Martelo de Thor' },
        { id: 2, name: 'Traje de encolhimento' },
      ], []];

      before(() => {
        sinon.stub(connection, 'execute').resolves(expectedReturn);
      })

      after(async () => {
        connection.execute.restore();
      });

      it('O retorno é um array', async () => {
        const resultado = await productModel.getAll();
        expect(resultado).to.be.an('array');
      })

      it('Os elementos da array são objetos', async () => {
        const resultado = await productModel.getAll();
        expect(resultado).to.be.equal(expectedReturn[0]);
      })
    })
  });
});
