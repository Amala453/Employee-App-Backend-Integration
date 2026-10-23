// Task1: initiate app and run server at 3000

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the provided frontend build without modifying its files.
app.use(express.static(path.join(__dirname, 'dist', 'Frontend')));

app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));
// Task2: create mongoDB connection

// Add your MongoDB Atlas connection string to MONGODB_URI in your environment.
// Example format: mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://amala225002_db_user:2avD55aa@mernproject.fx1e8ws.mongodb.net/employeeDB?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((error) => {
        console.error('MongoDB connection failed:', error.message);
    });

// Employee collection and fields used by the provided frontend.
const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    salary: { type: Number, required: true }
}, { collection: 'employeelist', versionKey: false });

const Employee = mongoose.model('Employee', employeeSchema);

//Task 2 : write api with error handling and appropriate api mentioned in the TODO below

//TODO: get data from db  using api '/api/employeelist'
app.get('/api/employeelist', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve employees', error: error.message });
    }
});

//TODO: get single data from db  using api '/api/employeelist/:id'
app.get('/api/employeelist/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid employee ID' });
        }
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve employee', error: error.message });
    }
});

//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.post('/api/employeelist', async (req, res) => {
    try {
        const { name, location, position, salary } = req.body;
        if (name == null || location == null || position == null || salary == null || salary === '') {
            return res.status(400).json({ message: 'name, location, position and salary are required' });
        }
        const employee = await Employee.create({
            name,
            location,
            position,
            salary: Number(salary)
        });
        res.status(201).json(employee);
    } catch (error) {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid employee data', error: error.message });
        }
        res.status(500).json({ message: 'Failed to add employee', error: error.message });
    }
});

//TODO: delete a employee data from db by using api '/api/employeelist/:id'
app.delete('/api/employeelist/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid employee ID' });
        }
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted successfully', employee });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete employee', error: error.message });
    }
});

//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
const updateEmployee = async (req, res) => {
    try {
        const employeeId = req.params.id || req.body._id || req.body.id;
        if (!employeeId || !mongoose.isValidObjectId(employeeId)) {
            return res.status(400).json({ message: 'A valid employee _id is required' });
        }

        const updates = {};
        if (req.body.name !== undefined) updates.name = req.body.name;
        if (req.body.location !== undefined) updates.location = req.body.location;
        if (req.body.position !== undefined) updates.position = req.body.position;
        if (req.body.salary !== undefined) updates.salary = Number(req.body.salary);

        const employee = await Employee.findByIdAndUpdate(
            employeeId,
            { $set: updates },
            { new: true, runValidators: true }
        );
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (error) {
        if (error.name === 'ValidationError' || error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid employee data', error: error.message });
        }
        res.status(500).json({ message: 'Failed to update employee', error: error.message });
    }
};

app.put('/api/employeelist', updateEmployee);
app.put('/api/employeelist/:id', updateEmployee);

//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`Employee App server running at http://localhost:${PORT}`);
});
