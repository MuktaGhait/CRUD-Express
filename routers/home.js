
const express = require('express');
const Router = express.Router();
const Club = require('../models/club');
const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix =   Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + '-' + '.png'); // Unique filename
    }
  })
  const upload = multer({ storage: storage });


// Render the index page
Router.get('/', (req, res) => {
    res.render('index');
});

// Create / insert data
Router.post('/add',upload.single('uploaded_file'), async (req, res) => {
    const {name, email} = req.body;
    const uploaded_file=req.file.path;

    if (!uploaded_file) {
        return res.status(400).send('No file uploaded.');
    }

    const club = new Club({
        name,
        email,
         uploaded_file
    });

    try {
        await club.save();
        res.redirect('/');
    } catch (err) {
        console.log("Error is:", err);
        res.status(500).send("Error occurred while saving data.");
    }
});

// Find data
Router.get('/show', async (req, res) => {
    try {
        const docs = await Club.find(); // use async/await
        res.render('show', {
            students: docs
        });
    } catch (err) {
        console.log("Error while fetching data:", err);
        res.status(500).send("Error occurred while fetching data.");
    }
});

// Update data
Router.get('/edit/:id', async (req, res) => {
    try {
        const docs = await Club.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }  // Ensure updated document is returned
        );
        res.render('edit', { studentdata: docs });
    } catch (err) {
        console.log("Can't update:", err);
        res.status(500).send("Error occurred while updating data.");
    }
});

// Edit form submission
Router.post('/edit/:id', upload.single('uploaded_file'), async (req, res) => {
    try {
        const { name, email } = req.body;
        let updatedData = { name, email };
        
        if (req.file) {
            updatedData.uploaded_file = req.file.path;  // Add the new file path if a file is uploaded
        }
        
        const doc = await Club.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        
        res.redirect('/show');
    } catch (err) {
        console.log("Error while updating:", err);
        res.status(500).send("Error occurred while updating data.");
    }
});

// Delete data
Router.get('/delete/:id', async (req, res) => {
    try {
        await Club.findByIdAndDelete({ _id: req.params.id });
        console.log("Deleted");
        res.redirect('/show');
    } catch (err) {
        console.log("Error while deleting:", err);
        res.status(500).send("Error occurred while deleting data.");
    }
});

module.exports = Router;
