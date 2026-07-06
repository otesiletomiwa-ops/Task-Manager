const authService = require('../services/auth.service');
const { generateToken } = require('../utils/jwt');
const { signupSchema, loginSchema } = require('../validators/auth.validator');

const signup = async (req, res) => {
    try {
        console.log("Signup Body:", req.body);  // Debug
        const validated = signupSchema.parse(req.body);
        const user = await authService.createUser(validated);
        res.status(201).json({ message: 'User registered', user });
    } catch (error) {
        console.error("Signup Error:", error);
        if (error.name === 'ZodError') {
            return res.status(400).json({ error: error.errors });
        }
        if (error.message === 'USER_EXISTS') {
            return res.status(409).json({ error: 'User already exists' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

const login = async (req, res) => {
    try {
        console.log("Login Body:", req.body);  // Debug
        const validated = loginSchema.parse(req.body);
        const user = await authService.authenticateUser(validated);
        const token = generateToken(user);
        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, email: user.email, name: user.name }
        });
    } catch (error) {
        console.error("Login Error:", error);
        if (error.name === 'ZodError') {
            return res.status(400).json({ error: error.errors });
        }
        if (error.message === 'INVALID_CREDENTIALS') {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { signup, login };
