
const express = require('express')
const router = require("./routes/router");
const cors = require("cors");
const app = express()
const port = 3000;

// middleware
app.use(express.json());
app.use(cors());

router(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
