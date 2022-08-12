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

      it('json é chamado com o objeto da venda', async () => {
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
});