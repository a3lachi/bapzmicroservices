const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');



const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Allow all origins to access the API


const PORT =  3002;





app.get('/', (req, res) => {
  res.send({'response':"Cart Service Up"})
});









console.log('CONNECTING SERVICE CART ON PORT ',PORT)
app.listen(PORT, () => {
  console.log(`Cart Service Server listening on port ${PORT}`);
});


