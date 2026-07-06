const prisma = require('../config/prisma');

const createTask = async (userId, data) => {
    return prisma.task.create({
        data: {
            ...data,
            userId: parseInt(userId),
            dueDate: new Date(data.dueDate)
        }
    });
};

const getUserTasks = async (userId) => {
    return prisma.task.findMany({
        where: { userId: parseInt(userId) },
        orderBy: { createdAt: 'desc' }
    });
};

const updateTask = async (taskId, userId, data) => {
    const task = await prisma.task.findUnique({
        where: { id: parseInt(taskId) }
    });

    if (!task || task.userId !== parseInt(userId)) {
        throw new Error('TASK_NOT_FOUND');
    }

    const updateData = { ...data };
    if (updateData.dueDate) {
        updateData.dueDate = new Date(updateData.dueDate);
    }

    return prisma.task.update({
        where: { id: parseInt(taskId) },
        data: updateData
    });
};

const deleteTask = async (taskId, userId) => {
    const task = await prisma.task.findUnique({
        where: { id: parseInt(taskId) }
    });

    if (!task || task.userId !== parseInt(userId)) {
        throw new Error('TASK_NOT_FOUND');
    }

    return prisma.task.delete({
        where: { id: parseInt(taskId) }
    });
};

module.exports = { createTask, getUserTasks, updateTask, deleteTask };