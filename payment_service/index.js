const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');



const app = express();app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Allow all origins to access the API


const PORT =  3006;





app.get('/', (req, res) => {
  res.send({'response':"Payment Service Up"})
});










app.listen(PORT, () => {
  console.log(`Payment Service Server listening on port ${PORT}`);
});


