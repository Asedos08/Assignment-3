// models/Task.js
const mongoose = require('mongoose');

/*Task Schema for MongoDB*/
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [100, 'Description cannot be more than 100 characters']
    },
    dueDate: {
        type: Date,
        required: [true, 'Due date']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Task', taskSchema);