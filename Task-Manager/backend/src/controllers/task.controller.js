const taskService = require('../services/task.service');

const createTask = async (req, res, next) => {
    try {
        const task = await taskService.createTask(req.user.id, req.validatedData);
        res.status(201).json({ message: "Task created", task });
    } catch (error) {
        next(error);
    }
};

const getTasks = async (req, res, next) => {
    try {
        const tasks = await taskService.getUserTasks(req.user.id);
        res.json({ tasks });
    } catch (error) {
        next(error);
    }
};

const updateTask = async (req, res, next) => {
    try {
        const task = await taskService.updateTask(req.params.id, req.user.id, req.validatedData);
        res.json({ message: "Task updated", task });
    } catch (error) {
        if (error.message === 'TASK_NOT_FOUND') {
            return res.status(404).json({ error: 'Task not found' });
        }
        next(error);
    }
};

const deleteTask = async (req, res, next) => {
    try {
        await taskService.deleteTask(req.params.id, req.user.id);
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        if (error.message === 'TASK_NOT_FOUND') {
            return res.status(404).json({ error: 'Task not found' });
        }
        next(error);
    }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };