const { expect } = require('chai');
const sinon = require('sinon');
const productService = require('../../../services/productService');
const productController = require('../../../controllers/productController');
const productMidlleware = require('../../../middlewares/productMiddleware');

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

      after(() => {
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

  describe('Quando adicionar um novo produto', () => {
    describe('Caso o', () => {
      describe('"name" é não fornecido', () => {
        const response = {};
        const request = {};
        const next = () => {};

        before(() => {
          request.body = {};
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();
        });

        it('status é chamado com o código 400', async () => {
          await productMidlleware.nameValidation(request, response, next);
          expect(response.status.calledWith(400)).to.be.true;
        });

        it('json é chamado com a mesagem de erro', async () => {
          await productMidlleware.nameValidation(request, response, next);
          const mss = { message: '"name" is required' };
          expect(response.json.calledWith(mss)).to.be.true;
        });
      });

      describe('"name" tem menos que 5 caracteres', () => {
        const response = {};
        const request = {};
        const next = () => { };

        before(() => {
          request.body = { name: 'abc' };
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();
        });

        it('status é chamado com o código 422', async () => {
          await productMidlleware.nameValidation(request, response, next);
          expect(response.status.calledWith(422)).to.be.true;
        });

        it('json é chamado com a mesagem de erro', async () => {
          await productMidlleware.nameValidation(request, response, next);
          const mss = { message: '"name" length must be at least 5 characters long' };
          expect(response.json.calledWith(mss)).to.be.true;
        });
      });

      describe('O "name" é fornecido corretamente', () => {
        const expectedReturn = { id: 1, name: 'rivotril' }

        const response = {};
        const request = {};

        before(() => {
          request.body = { name: 'rivotril' };
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();

          sinon.stub(productService, 'create').resolves(expectedReturn);
        });

        after(() => {
          productService.create.restore();
        })

        it('status é chamado com o código 201', async () => {
          await productController.create(request, response);
          expect(response.status.calledWith(201)).to.be.equal(true);
        })

        it('json é chamado com a array encontrada', async () => {
          await productController.create(request, response);
          expect(response.json.calledWith(expectedReturn)).to.be.equal(true);
        });
      });
    });
  });

  describe('Quando atualizar um produto existente', () => {
    describe('Se o produto não for encontrado', () => {
      const response = {};
      const request = {};

      before(() => {
        request.body = { name: 'rivotril' };
        request.params = { id: '8000' };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(productService, 'update').resolves(false);
      })

      after(() => {
        productService.update.restore();
      });

      it('status é chamado com o código 404', async () => {
        await productController.update(request, response);

        expect(response.status.calledWith(404)).to.be.equal(true);
      });

      it('send é chamado com a mensage de "Product not found"', async () => {
        await productController.update(request, response);
        const message = { message: 'Product not found' };

        expect(response.json.calledWith(message)).to.be.equal(true);
      });
    });

    describe('Caso o', () => {
      describe('"name" é não fornecido', () => {
        const response = {};
        const request = {};
        const next = () => { };

        before(() => {
          request.body = {};
          request.params = { id: '1' };
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();
        });

        it('status é chamado com o código 400', async () => {
          await productMidlleware.nameValidation(request, response, next);
          expect(response.status.calledWith(400)).to.be.true;
        });

        it('json é chamado com a mesagem de erro', async () => {
          await productMidlleware.nameValidation(request, response, next);
          const mss = { message: '"name" is required' };
          expect(response.json.calledWith(mss)).to.be.true;
        });
      });

      describe('"name" tem menos que 5 caracteres', () => {
        const response = {};
        const request = {};
        const next = () => { };

        before(() => {
          request.body = { name: 'abc' };
          request.params = { id: '1' };
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();
        });

        it('status é chamado com o código 422', async () => {
          await productMidlleware.nameValidation(request, response, next);
          expect(response.status.calledWith(422)).to.be.true;
        });

        it('json é chamado com a mesagem de erro', async () => {
          await productMidlleware.nameValidation(request, response, next);
          const mss = { message: '"name" length must be at least 5 characters long' };
          expect(response.json.calledWith(mss)).to.be.true;
        });
      });

      describe('O "name" é fornecido corretamente', () => {
        const expectedReturn = { id: 1, name: 'rivotril' }

        const response = {};
        const request = {};

        before(() => {
          request.body = { name: 'rivotril' };
          request.params = { id: '1' };
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();

          sinon.stub(productService, 'update').resolves(expectedReturn);
        });

        after(() => {
          productService.update.restore();
        })

        it('status é chamado com o código 200', async () => {
          await productController.update(request, response);
          expect(response.status.calledWith(200)).to.be.equal(true);
        })

        it('json é chamado com a array encontrada', async () => {
          await productController.create(request, response);
          expect(response.json.calledWith(expectedReturn)).to.be.equal(true);
        });
      });
    });
  });

  describe('Quando deletar um produto', () => {
    describe('Se o produto não for encontrado', () => {
      const response = {};
      const request = {};

      before(() => {
        request.params = { id: '8000' };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(productService, 'remove').resolves(false);
      })

      after(() => {
        productService.remove.restore();
      });

      it('status é chamado com o código 404', async () => {
        await productController.remove(request, response);

        expect(response.status.calledWith(404)).to.be.equal(true);
      });

      it('send é chamado com a mensage de "Product not found"', async () => {
        await productController.remove(request, response);
        const message = { message: 'Product not found' };

        expect(response.json.calledWith(message)).to.be.equal(true);
      });
    });

    describe('Se o produto foi encontrado e deletado', () => {
      const request = {};
      const response = {};

      before(() => {
        request.params = { id: '22' };
        response.status = sinon.stub().returns(response);
        response.end = sinon.stub().returns();
        sinon.stub(productService, 'remove').resolves(true);
      });

      after(() => {
        productService.remove.restore();
      });

      it('status é chamada com o código 204', async () => {
        await productController.remove(request, response);
        expect(response.status.calledWith(204)).to.be.equal(true);
      });

      it('end é chamada com uma mensagem vazia', async () => {
        await productController.remove(request, response);
        expect(response.end.calledWith()).to.be.equal(true);
      });
    });
  });

  describe('Quando realizar uma busca por nome', () => {
    describe('Se nenhum produto for encontrado', () => {
      const response = {};
      const request = {};

      before(() => {
        request.query = { q: 'casa' };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(productService, 'findByName').resolves(false);
      })

      after(() => {
        productService.findByName.restore();
      });

      it('status é chamado com o código 404', async () => {
        await productController.findByName(request, response);

        expect(response.status.calledWith(404)).to.be.equal(true);
      });

      it('send é chamado com a mensage de "Product not found"', async () => {
        await productController.findByName(request, response);
        const message = { message: 'Product not found' };

        expect(response.json.calledWith(message)).to.be.equal(true);
      });
    });

    describe('Se algum produto for encontrado', () => {
      const expectedReturn = [{ id: 1, name: 'Martelo de Thor' }]

      const response = {};
      const request = {};

      before(() => {
        request.query = { q: 'Martelo' };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();

        sinon.stub(productService, 'findByName').resolves(expectedReturn);
      })

      after(async () => {
        productService.findByName.restore();
      });

      it('status é chamado com o código 200', async () => {
        await productController.findByName(request, response);
        expect(response.status.calledWith(200)).to.be.equal(true);
      })

      it('json é chamado com a array encontrada', async () => {
        await productController.findByName(request, response);
        expect(response.json.calledWith(expectedReturn)).to.be.equal(true);
      })
    });
  });
});