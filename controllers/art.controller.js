const express = require('express');
const router = express.Router();
const Art = require('../models/art.model');
// const auth = require('../middlewares/publicauth.middleware');
const { validate, Joi } = require('express-validation');

const artValidation = {
    body: Joi.object({
        artname: Joi.string()
            .required()
    }),
};

router.post('', validate(artValidation, {}, {}), async (req, res) => {
    let request = req.body;
    let art = await Art.findOne({ artname: request.artname });
    if (!art) {
        var newArt = new Art({
            artname: request.artname,
            active: true,
            createdat: Date.now(),
            createdby: req.sessionUser.username
        });
        newArt.save()
            .then(_ => { res.Success("Art created successfully."); })
            .catch(err => {
                console.log(err);
                res.Error("Error creating art.");
            });
    } else {
        res.Exists("The art already exists.");
    }
});

router.put('/:id', validate(artValidation, {}, {}), async (req, res) => {
    let id = req.params.id;
    let request = req.body;
    var art = await Art.findById(id)
        .catch(err => {
            console.log(err);
            res.Exception("Error finding art.");
        });
    if (!art) res.NotFound("Art not found");
    else {
        await Art.findByIdAndUpdate(id, {
            artname: request.artname,
            updatedat: Date.now(),
            updatedby: req.sessionUser.username
        })
            .then(_ => { res.Success("Art updated successfully."); })
            .catch(err => {
                console.log(err);
                res.Exception("Error updating art details.");
            });
    }
});

router.get('', async (req, res) => {
    var arts = await Art.find({ active: true })
        .catch(err => {
            console.log(err);
            res.Exception("Error fetching list of arts.");
        });
    res.Success("Arts found", arts);
});

router.get('/:id', async (req, res) => {
    let id = req.params.id;
    var art = await Art.findById(id)
        .catch(err => {
            console.log(err);
            res.Exception("Error finding art.");
        });
    if (!art)
        res.NotFound("Art not found");
    else
        res.Success("Art found", art);
});

/// Here we are doing only a soft delete on the course collection.
router.delete('/:id', async (req, res) => {
    let id = req.params.id;
    await Art.findByIdAndUpdate(id, {
        active: false,
        updatedat: Date.now(),
        updatedby: req.sessionUser.username
    })
        .then(_ => { res.Success("Deleted Art successfully."); })
        .catch(err => {
            console.log(err);
            res.Exception("Error deleting Art.");
        });
});

module.exports = router;