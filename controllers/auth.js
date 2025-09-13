const supabase = require("../db")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const JWT_SECRET = process.env.JWT_SECRET

// ---------------- SIGN-UP ----------------
const signUp = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  // Check if user already exists
  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email.toLowerCase())

  if (error) return res.status(500).json({ error: error.message })
  if (users.length > 0) return res.status(400).json({ error: "User already exists" })

  // Hash password and insert new user
  const hashedPassword = await bcrypt.hash(password, 10)

  const { data: newUser, error: insertError } = await supabase
    .from("users")
    .insert({ name, email: email.toLowerCase(), password: hashedPassword })
    .select()

  if (insertError) return res.status(500).json({ error: insertError.message })
  if (!newUser || newUser.length === 0) return res.status(500).json({ error: "User could not be created" })

  // Generate JWT
  const token = jwt.sign({ id: newUser[0].id, email: newUser[0].email }, JWT_SECRET, { expiresIn: "1h" })

  return res.status(200).json({ message: "User created successfully", token })
}

// ---------------- LOGIN ----------------
const login = async (req, res) => {
  const { email, password } = req.body
  
  if (!email || !password) return res.status(400).json({ error: "Missing required fields" })

  // Find user by email
  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email.toLowerCase())

  if (error) return res.status(500).json({ error: error.message })
  if (!users || users.length === 0) return res.status(404).json({ error: "User not found" })

  const user = users[0]

  // Check password
  const isValidPassword = await bcrypt.compare(password, user.password)
  if (!isValidPassword) return res.status(401).json({ error: "Invalid password" })

  // Generate JWT
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" })

  return res.status(200).json({ message: "Logged in successfully", token })
}

module.exports = {
  signUp,
  login
}
