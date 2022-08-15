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

  describe('Quando realizar uma busca por todas as vendas', () => {
    describe('Se nenhuma venda for encontrado', () => {
      const expectedReturn = [[], []];

      before(() => {
        sinon.stub(connection, 'execute').resolves(expectedReturn);
      })

      after(async () => {
        connection.execute.restore();
      });
      it('Retorna um array', async () => {
        const resultado = await salesModel.getAll();
        expect(resultado).to.be.an('array');
      });

      it('O array está vazio', async () => {
        const resultado = await salesModel.getAll();
        expect(resultado).to.be.empty;
      });
    });

    describe('Se as vendas forem encontradas', () => {
      const expectedReturn = [[
        { saleId: 1, date: '2021-09-09T04:54:29.000Z', productId: 1, quantity: 2 },
        { saleId: 1, date: '2021-09-09T04:54:54.000Z', productId: 2, quantity: 2 },
        { saleId: 2, date: '2021-09-09T04:54:29.000Z', productId: 1, quantity: 3 },
        { saleId: 2, date: '2021-09-09T04:54:54.000Z', productId: 2, quantity: 1 },
      ], []];

      before(() => {
        sinon.stub(connection, 'execute').resolves(expectedReturn);
      })

      after(async () => {
        connection.execute.restore();
      });

      it('O retorno é um array', async () => {
        const resultado = await salesModel.getAll();
        expect(resultado).to.be.an('array');
      })

      it('Os elementos da array são objetos', async () => {
        const resultado = await salesModel.getAll();
        expect(resultado).to.be.equal(expectedReturn[0]);
      })
    });
  });

  describe('Quando realizar uma busca por id', () => {
    describe('Se a venda não for encontrada', () => {
      const expectedReturn = [[], []];

      before(() => {
        sinon.stub(connection, 'execute').resolves(expectedReturn);
      })

      after(async () => {
        connection.execute.restore();
      });
      it('Retorna um array', async () => {
        const resultado = await salesModel.findById(8000);
        expect(resultado).to.be.an('array');
      });

      it('O array está vazio', async () => {
        const resultado = await salesModel.findById(8000);
        expect(resultado).to.be.empty;
      });
    });

    describe('Se a venda for encontrada', () => {
      const expectedReturn = [[
        { date: '2021-09-09T04:54:29.000Z', productId: 1, quantity: 2 },
        { date: '2021-09-09T04:54:54.000Z', productId: 2, quantity: 2 },
      ], []];

      before(() => {
        sinon.stub(connection, 'execute').resolves(expectedReturn);
      })

      after(async () => {
        connection.execute.restore();
      });

      it('Retorna um array', async () => {
        const resultado = await salesModel.findById(1);
        expect(resultado).to.be.an('array');
      });

      it('O array contem um objeto', async () => {
        const resultado = await salesModel.findById(1);
        expect(resultado[0]).to.be.a('object');
      });

      it('O produto é o Martelo de Thor', async () => {
        const resultado = await salesModel.findById(1);
        expect(resultado).to.be.equal(expectedReturn[0]);
      });
    });
  });
});