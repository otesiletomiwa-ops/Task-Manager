const express = require('express');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/task.controller');
const { authenticate } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { createTaskSchema, updateTaskSchema } = require('../validators/task.validator');

const router = express.Router();

router.use(authenticate);

router.post('/', validate(createTaskSchema), createTask);
router.get('/', getTasks);
router.put('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

module.exports = router;