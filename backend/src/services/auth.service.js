const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');

const createUser = async ({ email, password, name }) => {
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        throw new Error('USER_EXISTS');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name
        },
        select: {
            id: true,
            email: true,
            name: true
        }
    });
};

const authenticateUser = async ({ email, password }) => {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new Error('INVALID_CREDENTIALS');
    }

    const validPassword = await bcrypt.compare(
        password,
        user.password
    );

    if (!validPassword) {
        throw new Error('INVALID_CREDENTIALS');
    }

    return user;
};

module.exports = {
    createUser,
    authenticateUser
};