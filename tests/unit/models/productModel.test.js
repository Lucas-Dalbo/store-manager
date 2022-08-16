const { expect } = require('chai');
const sinon = require('sinon');
const connection = require('../../../models/connection');
const productModel = require('../../../models/productModel');

describe('Testes de productModel', () => {
  describe('Quando realizar uma busca por todos os produtos', () => {
    describe('Se nenhum produto for encontrado', () => {
      const expectedReturn = [[], []];

      before(() => {
        sinon.stub(connection, 'execute').resolves(expectedReturn);
      })

      after(async () => {
        connection.execute.restore();
      });
      it('Retorna um array', async () => {
        const resultado = await productModel.getAll();
        expect(resultado).to.be.an('array');
      });

      it('O array está vazio', async () => {
        const resultado = await productModel.getAll();
        expect(resultado).to.be.empty;
      });
    });
    describe('Se os produtos forem encontrados', () => {
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
    });
  });

  describe('Quando realizar uma busca por id', () => {
    describe('Se o produto não for encontrado', () => {
      const expectedReturn = [[], []];

      before(() => {
        sinon.stub(connection, 'execute').resolves(expectedReturn);
      })

      after(async () => {
        connection.execute.restore();
      });

      it('Retorna um array', async () => {
        const resultado = await productModel.findById(8000);
        expect(resultado).to.be.an('array');
      });

      it('O array está vazio', async () => {
        const resultado = await productModel.findById(8000);
        expect(resultado).to.be.empty;
      });
    });
    describe('Se o produto for encontrado', () => {
      const expectedReturn = [[{ id: 1, name: 'Martelo de Thor' }]];

      before(() => {
        sinon.stub(connection, 'execute').resolves(expectedReturn);
      })

      after(async () => {
        connection.execute.restore();
      });
      
      it('Retorna um array', async () => {
        const resultado = await productModel.findById(8000);
        expect(resultado).to.be.an('array');
      });

      it('O array contem um objeto', async () => {
        const resultado = await productModel.findById(8000);
        expect(resultado[0]).to.be.a('object');
        expect(resultado[1]).to.be.undefined;
      });

      it('O produto é o Martelo de Thor', async () => {
        const resultado = await productModel.findById(8000);
        expect(resultado).to.be.equal(expectedReturn[0]);
      });
    });
  });

  describe('Quando adicionar um novo produto', () => {
    describe('Se é adicionado com sucesso', () => {

      before(() => {
        const returned = [{ insertedId: 1 }]
        sinon.stub(connection, 'execute').resolves(returned);
      })

      after(() => {
        connection.execute.restore();
      });

      it('O retorno é um objeto', async () => {
        const result = await productModel.create('Produto');
        expect(result).to.be.a('object');
      })

      it('O objeto contém a propriedade id', async () => {
        const result = await productModel.create('Produto');
        expect(result).to.have.property('id');
      });

      it('O objeto contém a propriedade name', async () => {
        const result = await productModel.create('Produto');
        expect(result).to.have.property('name');
      });
    });
  });

  describe('Quando editar um produto existente', () => {
    describe('Se houver sucesso', () => {
      before(() => {
        sinon.stub(connection, 'execute').resolves();
      })

      after(() => {
        connection.execute.restore();
      });

      it('O retorno é um objeto', async () => {
        const result = await productModel.update(1, 'Produto');
        expect(result).to.be.a('object');
      })

      it('O objeto contém o id e o novo nome', async () => {
        const updatedProduct = { id: 1, name: 'Produto' }

        const result = await productModel.update(1, 'Produto');
        expect(result).to.be.deep.equal(updatedProduct);
      });
    });
  });

  describe('Quando deletar um produto', () => {
    describe('Se o produto não existir', () => {
      before(() => {
        const returned = [{ affectedRows: 0 }]
        sinon.stub(connection, 'execute').resolves(returned);
      });

      after(() => {
        connection.execute.restore();
      });

      it('O retorno é um number', async () => {
        const result = await productModel.remove(8000);
        expect(result).to.be.a('number');
      });

      it('O number tem valor 0', async () => {
        const result = await productModel.remove(8000);
        expect(result).to.be.equal(0);
      });
    });

    describe('Se o produto existia e foi deletado', () => {
      before(() => {
        const returned = [{ affectedRows: 1 }]
        sinon.stub(connection, 'execute').resolves(returned);
      })

      after(() => {
        connection.execute.restore();
      });

      it('O retorno é um number', async () => {
        const result = await productModel.remove(22);
        expect(result).to.be.a('number');
      });

      it('O number tem valor 1', async () => {
        const result = await productModel.remove(22);
        expect(result).to.be.equal(1);
      });
    });
  });
});
