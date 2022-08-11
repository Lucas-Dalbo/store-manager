const { expect } = require('chai');
const sinon = require('sinon');
const productService = require('../../../services/productService');
const productController = require('../../../controllers/productController');

describe('Testes de productController', () => {
  describe('Quando realizar uma busca por todos os produtos', () => {
    describe('Se o produto não for encontrado', () => {
      const expectedReturn = [];

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
      it('status é chamado com o código 404', async () => {
        await productController.getAll(request, response);

        expect(response.status.calledWith(404)).to.be.equal(true);
      });

      it('send é chamado com a mensagem "Nenhum produto encontrado"', async () => {
        await productController.getAll(request, response);
        const message = { message: 'Nenhum produto encontrado' };

        expect(response.json.calledWith(message)).to.be.equal(true);
      });
    });

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
    });
  });

  describe('Quando realizar uma busca por id', () => {
    describe('Se o produto não for encontrado', () => {
      const response = {};
      const request = {};

      before(() => {
        request.params = { id: '8000' };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(productService, 'findById').resolves(false);
      })

      after(async () => {
        productService.findById.restore();
      });

      it('status é chamado com o código 404', async () => {
        await productController.findById(request, response);

        expect(response.status.calledWith(404)).to.be.equal(true);
      });

      it('send é chamado com a mensage de "Product not found"', async () => {
        await productController.findById(request, response);
        const message = { message: 'Product not found' };

        expect(response.json.calledWith(message)).to.be.equal(true);
      });
    });

    describe('Se o produto for encontrado', () => {
      const expectedReturn = { id: 1, name: 'Martelo de Thor' }

      const response = {};
      const request = {};

      before(() => {
        request.params = { id: '1' };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(productService, 'findById').resolves(expectedReturn);
      })

      after(async () => {
        productService.findById.restore();
      });

      it('status é chamado com o código 200', async () => {
        await productController.findById(request, response);
        expect(response.status.calledWith(200)).to.be.equal(true);
      })

      it('json é chamado com a array encontrada', async () => {
        await productController.findById(request, response);
        expect(response.json.calledWith(expectedReturn)).to.be.equal(true);
      })
    });
  });
});