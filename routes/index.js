var express = require('express');
var router = express.Router();
const Task = require('../models/Task');

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    console.log('Attempting to connect to database...');
    const tasks = await Task.find().sort({ dueDate: 1 });
    console.log(`Successfully fetched ${tasks.length} tasks from database`);
    
    res.render('index', { 
      title: 'TaskPlanner - Home',
      tasks: tasks
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    console.error('Connection string:', process.env.MONGODB_URI ? 'Exists' : 'Missing');
    next(error);
  }
});

/**
 * Test route to check database connection
 */
router.get('/test-db', async (req, res) => {
  try {
    // Test connection by counting tasks
    const taskCount = await Task.countDocuments();
    
    // Try to create a test task
    const testTask = new Task({
      title: 'Test Task - Database Connection',
      description: 'This is a test task to verify database connection',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });
    
    await testTask.save();
    console.log('Test task created successfully');
    
    res.json({
      success: true,
      message: 'Database connection successful!',
      taskCount: taskCount,
      testTaskId: testTask._id
    });
    
  } catch (error) {
    console.error('Database test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

module.exports = router;