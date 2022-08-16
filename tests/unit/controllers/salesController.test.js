const { expect } = require('chai');
const sinon = require('sinon');
const salesService = require('../../../services/salesService');
const salesController = require('../../../controllers/salesController');
const salesMiddleware = require('../../../middlewares/salesMiddleware');

describe('Testes de salesController', () => {
  describe('Quando adicionar uma nova venda', () => {
    describe('Se não houverem informações', () => {
      const request = {};
      const response = {};
      const next = () => {};

      before(() => {
        request.body = {};
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns(response);
      });

      it('status é chamado com o código 400', async () => {
        await salesMiddleware.saleValidation(request, response, next);
        expect(response.status.calledWith(400)).to.be.true;
      });

      it('json é chamado com a mesagem de erro', async () => {
        await salesMiddleware.saleValidation(request, response, next);
        const mss = { message: 'Invalid body json' };
        expect(response.json.calledWith(mss)).to.be.true;
      });
    });

    describe('Se productId for inválido', () => {
      const request = {};
      const response = {};
      const next = () => { };

      before(() => {
        request.body = [{ quantity: 5 }];
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns(response);
      });

      it('status é chamado com o código 400', async () => {
        await salesMiddleware.saleValidation(request, response, next);
        expect(response.status.calledWith(400)).to.be.true;
      });

      it('json é chamado com a mesagem de erro', async () => {
        await salesMiddleware.saleValidation(request, response, next);
        const mss = { message: '"productId" is required' };
        expect(response.json.calledWith(mss)).to.be.true;
      });      
    });

    describe('Se productId não exitir no banco', () => {
      const request = {};
      const response = {};
      const next = () => { };

      const expectedResult = { message: 'Product not found' };

      before(() => {
        request.body = [{ productId: 80, quantity: 1 }];
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns(response);
        sinon.stub(salesService, 'create').resolves(expectedResult);
      });

      after(() => {
        salesService.create.restore();
      })

      it('status é chamado com o código 404', async () => {
        await salesController.create(request, response, next);
        expect(response.status.calledWith(404)).to.be.true;
      });

      it('json é chamado com o objeto de erro', async () => {
        await salesController.create(request, response, next);
        expect(response.json.calledWith(expectedResult)).to.be.true;
      });
    });

    describe('Se quantity for inválido', () => {
      const request = {};
      const response = {};
      const next = () => { };

      before(() => {
        request.body = [{ productId: 5 }];
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns(response);
      });

      it('status é chamado com o código 400', async () => {
        await salesMiddleware.saleValidation(request, response, next);
        expect(response.status.calledWith(400)).to.be.true;
      });

      it('json é chamado com a mesagem de erro', async () => {
        await salesMiddleware.saleValidation(request, response, next);
        const mss = { message: '"quantity" is required' };
        expect(response.json.calledWith(mss)).to.be.true;
      });
    });

    describe('Se quantity for menor que 1', () => {
      const request = {};
      const response = {};
      const next = () => { };

      before(() => {
        request.body = [{ productId: 1, quantity: 0 }];
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns(response);
      });

      it('status é chamado com o código 422', async () => {
        await salesMiddleware.saleValidation(request, response, next);
        expect(response.status.calledWith(422)).to.be.true;
      });

      it('json é chamado com a mesagem de erro', async () => {
        await salesMiddleware.saleValidation(request, response, next);
        const mss = { message: '"quantity" must be greater than or equal to 1' };
        expect(response.json.calledWith(mss)).to.be.true;
      });
    });

    describe('Se as informações estiverem corretas', () => {
      const request = {};
      const response = {};
      const next = () => { };
      
      const expectedResult = {
        id: 1,
        itemsSold: [
          {
            productId: 1,
            quantity: 1,
          }
        ]
      };

      before(() => {
        request.body = [{ productId: 1, quantity: 1 }];
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns(response);
        sinon.stub(salesService, 'create').resolves(expectedResult);
      });

      after(() => {
        salesService.create.restore();
      })

      it('status é chamado com o código 201', async () => {
        await salesController.create(request, response, next);
        expect(response.status.calledWith(201)).to.be.true;
      });

      it('json é chamado com o objeto da venda', async () => {
        await salesController.create(request, response, next);
        expect(response.json.calledWith(expectedResult)).to.be.true;
      });
    });
  });

  describe('Quando realizar uma busca por todas as vendas', () => {
    describe('Se nenhuma venda for encontrada', () => {
      const expectedReturn = [];

      const response = {};
      const request = {};

      before(() => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(salesService, 'getAll').resolves(expectedReturn);
      })

      after(async () => {
        salesService.getAll.restore();
      });

      it('status é chamado com o código 404', async () => {
        await salesController.getAll(request, response);

        expect(response.status.calledWith(404)).to.be.equal(true);
      });

      it('send é chamado com a mensagem "Sales not found"', async () => {
        await salesController.getAll(request, response);
        const message = { message: 'Sales not found' };

        expect(response.json.calledWith(message)).to.be.equal(true);
      });
    });

    describe('Se a requisição for um sucesso', () => {
      const expectedReturn = [
        { saleId: 1, date: '2021-09-09T04:54:29.000Z', productId: 1, quantity: 2 },
        { saleId: 1, date: '2021-09-09T04:54:54.000Z', productId: 2, quantity: 2 },
        { saleId: 2, date: '2021-09-09T04:54:29.000Z', productId: 1, quantity: 3 },
        { saleId: 2, date: '2021-09-09T04:54:54.000Z', productId: 2, quantity: 1 },
      ];

      const response = {};
      const request = {};

      before(() => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(salesService, 'getAll').resolves(expectedReturn);
      })

      after(async () => {
        salesService.getAll.restore();
      });

      it('status é chamado com o código 200', async () => {
        await salesController.getAll(request, response);
        expect(response.status.calledWith(200)).to.be.equal(true);
      })

      it('json é chamado com a array encontrada', async () => {
        await salesController.getAll(request, response);
        expect(response.json.calledWith(expectedReturn)).to.be.equal(true);
      })
    });
  });

  describe('Quando realizar uma busca por id', () => {
    describe('Se a venda não for encontrada', () => {
      const response = {};
      const request = {};

      before(() => {
        request.params = { id: '8000' };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(salesService, 'findById').resolves(false);
      })

      after(() => {
        salesService.findById.restore();
      });

      it('status é chamado com o código 404', async () => {
        await salesController.findById(request, response);

        expect(response.status.calledWith(404)).to.be.equal(true);
      });

      it('send é chamado com a mensage de "Sale not found"', async () => {
        await salesController.findById(request, response);
        const message = { message: 'Sale not found' };

        expect(response.json.calledWith(message)).to.be.equal(true);
      });
    });

    describe('Se a venda for encontrada', () => {
      const expectedReturn = [
        { date: '2021-09-09T04:54:29.000Z', productId: 1, quantity: 2 },
        { date: '2021-09-09T04:54:54.000Z', productId: 2, quantity: 2 },
      ];

      const response = {};
      const request = {};

      before(() => {
        request.params = { id: '1' };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(salesService, 'findById').resolves(expectedReturn);
      })

      after(async () => {
        salesService.findById.restore();
      });

      it('status é chamado com o código 200', async () => {
        await salesController.findById(request, response);
        expect(response.status.calledWith(200)).to.be.equal(true);
      })

      it('json é chamado com a array encontrada', async () => {
        await salesController.findById(request, response);
        expect(response.json.calledWith(expectedReturn)).to.be.equal(true);
      })
    });
  });

  describe('Quando deletar uma venda', () => {
    describe('Se a venda não for encontrada', () => {
      const response = {};
      const request = {};

      before(() => {
        request.params = { id: '8000' };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(salesService, 'remove').resolves(false);
      })

      after(() => {
        salesService.remove.restore();
      });

      it('status é chamado com o código 404', async () => {
        await salesController.remove(request, response);

        expect(response.status.calledWith(404)).to.be.equal(true);
      });

      it('send é chamado com a mensage de "Sale not found"', async () => {
        await salesController.remove(request, response);
        const message = { message: 'Sale not found' };

        expect(response.json.calledWith(message)).to.be.equal(true);
      });
    });

    describe('Se a venda for encontrada e deletada', () => {
      const request = {};
      const response = {};

      before(() => {
        request.params = { id: '22' };
        response.status = sinon.stub().returns(response);
        response.end = sinon.stub().returns();
        sinon.stub(salesService, 'remove').resolves(true);
      });

      after(() => {
        salesService.remove.restore();
      });

      it('status é chamada com o código 204', async () => {
        await salesController.remove(request, response);
        expect(response.status.calledWith(204)).to.be.equal(true);
      });

      it('end é chamada com uma mensagem vazia', async () => {
        await salesController.remove(request, response);
        expect(response.end.calledWith()).to.be.equal(true);
      });
    });
  });

  describe('Quando atualizar uma venda', () => {
    describe('Se não houverem informações', () => {
      const request = {};
      const response = {};
      const next = () => { };

      before(() => {
        request.params = { id: '1' };
        request.body = {};
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns(response);
      });

      it('status é chamado com o código 400', async () => {
        await salesMiddleware.saleValidation(request, response, next);
        expect(response.status.calledWith(400)).to.be.true;
      });

      it('json é chamado com a mesagem de erro', async () => {
        await salesMiddleware.saleValidation(request, response, next);
        const mss = { message: 'Invalid body json' };
        expect(response.json.calledWith(mss)).to.be.true;
      });
    });

    describe('Se productId for inválido', () => {
      const request = {};
      const response = {};
      const next = () => { };

      before(() => {
        request.params = { id: '1' };
        request.body = [{ quantity: 5 }];
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns(response);
      });

      it('status é chamado com o código 400', async () => {
        await salesMiddleware.saleValidation(request, response, next);
        expect(response.status.calledWith(400)).to.be.true;
      });

      it('json é chamado com a mesagem de erro', async () => {
        await salesMiddleware.saleValidation(request, response, next);
        const mss = { message: '"productId" is required' };
        expect(response.json.calledWith(mss)).to.be.true;
      });
    });

    describe('Se productId não exitir no banco', () => {
      const request = {};
      const response = {};

      const expectedResult = { message: 'Product not found' };

      before(() => {
        request.params = { id: '1' };
        request.body = [{ productId: 80, quantity: 1 }];
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns(response);
        sinon.stub(salesService, 'update').resolves(expectedResult);
      });

      after(() => {
        salesService.update.restore();
      })

      it('status é chamado com o código 404', async () => {
        await salesController.update(request, response);
        expect(response.status.calledWith(404)).to.be.true;
      });

      it('json é chamado com a mesnagem de erro', async () => {
        await salesController.update(request, response);
        expect(response.json.calledWith(expectedResult)).to.be.true;
      });
    });

    describe('Se quantity for inválido', () => {
      const request = {};
      const response = {};
      const next = () => { };

      before(() => {
        request.params = { id: '1' };
        request.body = [{ productId: 5 }];
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns(response);
      });

      it('status é chamado com o código 400', async () => {
        await salesMiddleware.saleValidation(request, response, next);
        expect(response.status.calledWith(400)).to.be.true;
      });

      it('json é chamado com a mesagem de erro', async () => {
        await salesMiddleware.saleValidation(request, response, next);
        const mss = { message: '"quantity" is required' };
        expect(response.json.calledWith(mss)).to.be.true;
      });
    });

    describe('Se quantity for menor que 1', () => {
      const request = {};
      const response = {};
      const next = () => { };

      before(() => {
        request.params = { id: '1' };
        request.body = [{ productId: 1, quantity: 0 }];
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns(response);
      });

      it('status é chamado com o código 422', async () => {
        await salesMiddleware.saleValidation(request, response, next);
        expect(response.status.calledWith(422)).to.be.true;
      });

      it('json é chamado com a mesagem de erro', async () => {
        await salesMiddleware.saleValidation(request, response, next);
        const mss = { message: '"quantity" must be greater than or equal to 1' };
        expect(response.json.calledWith(mss)).to.be.true;
      });
    });

    describe('Se a venda não existir no banco', () => {
      const request = {};
      const response = {};

      const expectedResult = { message: 'Sale not found' };

      before(() => {
        request.params = { id: '1' };
        request.body = [{ productId: 80, quantity: 1 }];
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns(response);
        sinon.stub(salesService, 'update').resolves(expectedResult);
      });

      after(() => {
        salesService.update.restore();
      })

      it('status é chamado com o código 404', async () => {
        await salesController.update(request, response);
        expect(response.status.calledWith(404)).to.be.true;
      });

      it('json é chamado com o objeto de erro', async () => {
        await salesController.update(request, response);
        expect(response.json.calledWith(expectedResult)).to.be.true;
      });
    });

    describe('Se as informações estiverem corretas', () => {
      const request = {};
      const response = {};

      const expectedResult = {
        id: 1,
        itemsUpdated: [
          {
            productId: 1,
            quantity: 1,
          }
        ]
      };

      before(() => {
        request.params = { id: '1' };
        request.body = [{ productId: 1, quantity: 1 }];
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns(response);
        sinon.stub(salesService, 'update').resolves(expectedResult);
      });

      after(() => {
        salesService.update.restore();
      })

      it('status é chamado com o código 200', async () => {
        await salesController.update(request, response);
        expect(response.status.calledWith(200)).to.be.true;
      });

      it('json é chamado com o objeto da venda', async () => {
        await salesController.update(request, response);
        expect(response.json.calledWith(expectedResult)).to.be.true;
      });
    });
  });
});