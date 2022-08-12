const { expect } = require('chai');
const sinon = require('sinon');
const connection = require('../../../models/connection');
const salesModel = require('../../../models/salesModel');

describe('Testes de salesModel', () => {
  describe('Ao cadastrar uma venda', () => {
    describe('Com sucesso', () => {
      const expectedReturn = [{ insertId: 1 }]

      before(() => {
        sinon.stub(connection, 'execute').resolves(expectedReturn);
      });

      after(() => {
        connection.execute.restore();
      });

      it('Retorna um número', async () => {
        const result = await salesModel.create();
        expect(result).to.be.a('number');
      });

      it('O número é maior que 0', async () => {
        const result = await salesModel.create();
        expect(result > 0).to.be.true;
      });
    });
  });
});