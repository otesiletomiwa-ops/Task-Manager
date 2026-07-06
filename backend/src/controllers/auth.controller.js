const authService = require('../services/auth.service');
const { generateToken } = require('../utils/jwt');

const signup = async (req, res, next) => {
    try {
        const user = await authService.createUser(req.validatedData);
        res.status(201).json({ message: 'User registered', user });
    } catch (error) {
        if (error.message === 'USER_EXISTS') {
            return res.status(409).json({ error: 'User already exists' });
        }
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const user = await authService.authenticateUser(req.validatedData);
        const token = generateToken(user);
        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, email: user.email, name: user.name }
        });
    } catch (error) {
        if (error.message === 'INVALID_CREDENTIALS') {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        next(error);
    }
};

module.exports = { signup, login };