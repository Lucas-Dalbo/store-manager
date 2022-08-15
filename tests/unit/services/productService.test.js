const { expect } = require('chai');
const sinon = require('sinon');
const productModel = require('../../../models/productModel');
const productService = require('../../../services/productService');

describe('Testes de productService', () => {
  describe('Quando realizar uma busca por todos os produtos', () => {
    describe('Se nenhum produto não for encontrado', () => {
      const expectedReturn = [];

      before(() => {
        sinon.stub(productModel, 'getAll').resolves(expectedReturn);
      })

      after(async () => {
        productModel.getAll.restore();
      });
      it('Retorna um array', async () => {
        const resultado = await productService.getAll();
        expect(resultado).to.be.an('array');
      });

      it('O array está vazio', async () => {
        const resultado = await productService.getAll();
        expect(resultado).to.be.empty;
      });
    });

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

  describe('Quando realizar uma busca por id', () => {
    describe('Se o produto não for encontrado', () => {
      const expectedReturn = [];

      before(() => {
        sinon.stub(productModel, 'findById').resolves(expectedReturn);
      })

      after(async () => {
        productModel.findById.restore();
      });

      it('Retorna um boleano', async () => {
        const resultado = await productService.findById(8000);
        expect(typeof resultado).to.be.equal('boolean');
      });

      it('Retorna false', async () => {
        const resultado = await productService.findById(8000);
        expect(resultado).to.be.false;
      });
    });

    describe('Se o produto for encontrado', () => {
      const expectedReturn = [{ id: 1, name: 'Martelo de Thor' }];

      before(() => {
        sinon.stub(productModel, 'findById').resolves(expectedReturn);
      })

      after(async () => {
        productModel.findById.restore();
      });

      it('Retorna um objeto', async () => {
        const resultado = await productService.findById(1);
        expect(resultado).to.be.an('object');
      });

      it('O produto é o Martelo de Thor', async () => {
        const resultado = await productService.findById(1);
        expect(resultado).to.be.equal(expectedReturn[0]);
      });
    });
  });

  describe('Quando adicionar um novo produto', () => {
    describe('Se é adicionado com sucesso', () => {

      before(() => {
        const returned = { id: 1, name: 'Produto' }
        sinon.stub(productModel, 'create').resolves(returned);
      })

      after(() => {
        productModel.create.restore();
      });

      it('O retorno é um objeto', async () => {
        const result = await productService.create('Produto');
        expect(result).to.be.a('object');
      })

      it('O objeto contém a propriedade id', async () => {
        const result = await productService.create('Produto');
        expect(result).to.have.property('id');
      });

      it('O objeto contém a propriedade name', async () => {
        const result = await productService.create('Produto');
        expect(result).to.have.property('name');
      });
    });
  });

  describe('Quando atualizar um produto', () => {
    describe('Se o produto não for encontrado', () => {
      before(() => {
        const product = []
        sinon.stub(productModel, 'findById').resolves(product);
      })

      after(async () => {
        productModel.findById.restore();
      });

      it('Retorna um boleano', async () => {
        const resultado = await productService.update(8000, 'Produto');
        expect(typeof resultado).to.be.equal('boolean');
      });

      it('Retorna false', async () => {
        const resultado = await productService.update(8000, 'Produto');
        expect(resultado).to.be.false;
      });
    });

    describe('Se é atualizado com sucesso', () => {
      const expectedReturned = { id: 1, name: 'Produto' }
      before(() => {
        const product = [{ id: 1, name: 'produtinho' }];
        sinon.stub(productModel, 'findById').resolves(product);
        sinon.stub(productModel, 'update').resolves(expectedReturned);
      })

      after(() => {
        productModel.update.restore();
      });

      it('O retorno é um objeto', async () => {
        const result = await productService.update(1, 'Produto');
        expect(result).to.be.a('object');
      })

      it('O objeto contém o id e o novo nome', async () => {
        const result = await productModel.update(1, 'Produto');
        expect(result).to.be.deep.equal(expectedReturned);
      });
    });
  });
});
