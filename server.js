require("dotenv").config()
const express = require("express")
const cors = require("cors")
const app = express()
const auth = require("./routes/auth")

app.use(express.json())
app.use(cors())
app.use("/", auth)

const PORT = process.env.PORT || 30000
app.listen(PORT, () => console.log(`Server is running on: http://localhost:${PORT}`))