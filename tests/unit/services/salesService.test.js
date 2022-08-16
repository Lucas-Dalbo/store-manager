const { expect } = require('chai');
const sinon = require('sinon');
const productModel = require('../../../models/productModel');
const salesModel = require('../../../models/salesModel');
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

  describe('Quando realizar uma busca por todas as vendas', () => {
    describe('Se nenhuma venda não for encontrada', () => {
      const expectedReturn = [];

      before(() => {
        sinon.stub(salesModel, 'getAll').resolves(expectedReturn);
      })

      after(async () => {
        salesModel.getAll.restore();
      });
      it('Retorna um array', async () => {
        const resultado = await salesService.getAll();
        expect(resultado).to.be.an('array');
      });

      it('O array está vazio', async () => {
        const resultado = await salesService.getAll();
        expect(resultado).to.be.empty;
      });
    });

    describe('Se a requisição for um sucesso', () => {
      const expectedReturn = [
        { saleId: 1, date: '2021-09-09T04:54:29.000Z', productId: 1, quantity: 2 },
        { saleId: 1, date: '2021-09-09T04:54:54.000Z', productId: 2, quantity: 2 },
        { saleId: 2, date: '2021-09-09T04:54:29.000Z', productId: 1, quantity: 3 },
        { saleId: 2, date: '2021-09-09T04:54:54.000Z', productId: 2, quantity: 1 },
      ];

      before(() => {
        sinon.stub(salesModel, 'getAll').resolves(expectedReturn);
      })

      after(async () => {
        salesModel.getAll.restore();
      });

      it('O retorno é um array', async () => {
        const resultado = await salesService.getAll();
        expect(resultado).to.be.an('array');
      })

      it('Os elementos da array são objetos', async () => {
        const resultado = await salesService.getAll();
        expect(resultado).to.be.equal(expectedReturn);
      })
    })
  });

  describe('Quando realizar uma busca por id', () => {
    describe('Se a venda não for encontrada', () => {
      const expectedReturn = [];

      before(() => {
        sinon.stub(salesModel, 'findById').resolves(expectedReturn);
      })

      after(async () => {
        salesModel.findById.restore();
      });

      it('Retorna um boleano', async () => {
        const resultado = await salesService.findById(8000);
        expect(typeof resultado).to.be.equal('boolean');
      });

      it('Retorna false', async () => {
        const resultado = await salesService.findById(8000);
        expect(resultado).to.be.false;
      });
    });

    describe('Se a venda for encontrada', () => {
      const expectedReturn = [
        { date: '2021-09-09T04:54:29.000Z', productId: 1, quantity: 2 },
        { date: '2021-09-09T04:54:54.000Z', productId: 2, quantity: 2 },
      ];

      before(() => {
        sinon.stub(salesModel, 'findById').resolves(expectedReturn);
      })

      after(async () => {
        salesModel.findById.restore();
      });

      it('Retorna um array', async () => {
        const resultado = await salesService.findById(1);
        expect(resultado).to.be.an('array');
      });

      it('A venda resultante é igual a expectedReturn', async () => {
        const resultado = await salesService.findById(1);
        expect(resultado).to.be.equal(expectedReturn);
      });
    });
  });

  describe('Quando deletar uma venda', () => {
    describe('Se a venda for encontrada', () => {
      before(() => {
        const returned = 0;
        sinon.stub(salesModel, 'remove').resolves(returned);
      })

      after(() => {
        salesModel.remove.restore();
      });

      it('O retorno é um boleano', async () => {
        const result = await salesService.remove(8000);
        expect(result).to.be.a('boolean');
      });

      it('O boleano é false', async () => {
        const result = await salesService.remove(8000);
        expect(result).to.be.equal(false);
      });
    });

    describe('Se a venda foi encontrada e deletada', () => {
      before(() => {
        const returned = 1;
        sinon.stub(salesModel, 'remove').resolves(returned);
      })

      after(() => {
        salesModel.remove.restore();
      });

      it('O retorno é um bolenao', async () => {
        const result = await salesService.remove(22);
        expect(result).to.be.a('boolean');
      });

      it('O boleano é true', async () => {
        const result = await salesService.remove(22);
        expect(result).to.be.equal(true);
      });
    });
  });
});