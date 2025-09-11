require("dotenv").config()
const express = require("express")
const supabase = require("./db.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const app = express()

app.use(express.json())

const JWT_SECRET = process.env.JWT_SECRET

// sign up
app.post("/sign-up", async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) return res.status(400).json({ error: "Missing required fields" })

    const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single()

    if (existingUser) return res.status(400).json({ error: "User already exists" })

    const hashedPassword = await bcrypt.hash(password, 10)

    const { data, error } = await supabase
        .from("users")
        .insert({ email, password: hashedPassword })
        .select()

    if (error) return res.status(500).json({ error: error.message })
    if (!data || data.length === 0) return res.status(500).json({ error: "User could not be created" })

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" })

    return res.status(200).json({ message: "User created successfully", token })
})

// login 
app.post("/login", async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) return res.status(400).json({ error: "Missing required fields" })

    const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single()

    if (!existingUser) return res.status(404).json({ error: "User not found" })

    const isValidPassword = await bcrypt.compare(password, existingUser.password)
    if (!isValidPassword) return res.status(500).json({ error: "Invalid password" })

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" })  

    return res.status(200).json({ message: "Logged in successfully", token })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server is running on: http://localhost:${PORT}`))