// routes/tasks.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

/* GET task to display all tasks*/
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ dueDate: 1 });
        res.render('index', { 
            title: 'TaskPlanner - All Tasks',
            tasks: tasks
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).render('error', { 
            error: error,
            message: 'Error loading tasks'
        });
    }
});

/* GET tasks/new to show form to create new task*/
router.get('/new', (req, res) => {
    res.render('tasks/new', { 
        title: 'Add New Task',
        task: {},
        error: null
    });
});

/*POST tasks to create new task*/
router.post('/', async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;
        
        const newTask = new Task({
            title,
            description,
            dueDate
        });

        await newTask.save();
        res.redirect('/');
    } catch (error) {
        console.error('Error creating task:', error);
        res.render('tasks/new', {
            title: 'Add New Task - Error',
            task: req.body,
            error: 'Error creating task. Please try again.'
        });
    }
});

/*GET /tasks/:id/edit to show form to edit task*/
router.get('/:id/edit', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).render('error', {
                message: 'Task not found'
            });
        }
        
        res.render('tasks/edit', {
            title: 'Edit Task',
            task: task,
            error: null
        });
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).render('error', {
            error: error,
            message: 'Error loading task'
        });
    }
});

/*POST /tasks/:id/update - Update task*/
router.post('/:id/update', async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;
        
        await Task.findByIdAndUpdate(req.params.id, {
            title,
            description,
            dueDate
        });

        res.redirect('/');
    } catch (error) {
        console.error('Error updating task:', error);
        
        try {
            const task = await Task.findById(req.params.id);
            res.render('tasks/edit', {
                title: 'Edit Task - Error',
                task: task,
                error: 'Error updating task. Please try again.'
            });
        } catch (fetchError) {
            res.redirect('/');
        }
    }
});

/* DELETE /tasks/:id - Delete task*/
router.post('/:id/delete', async (req, res) => {
    try {
        console.log('Attempting to delete task:', req.params.id);
        await Task.findByIdAndDelete(req.params.id);
        console.log('Task deleted successfully');
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).render('error', {
            error: error,
            message: 'Error deleting task'
        });
    }
});

module.exports = router;