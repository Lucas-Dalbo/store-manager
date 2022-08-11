require('dotenv').config();
const bodyParser = require('body-parser');
const app = require('./app');
const productRoute = require('./routes/productRoute');

// não altere esse arquivo, essa estrutura é necessária para à avaliação do projeto

app.listen(process.env.PORT, () => {
  console.log(`Escutando na porta ${process.env.PORT}`);
});

app.use(bodyParser.json());

app.use('/products', productRoute);
