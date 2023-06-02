const express = require('express');
const router = express.Router();
const Art = require('../models/art.model');
const auth = require('../middlewares/publicauth');
const reqverify = require('../middlewares/requestverify');
const { validate, Joi } = require('express-validation');

const artValidation = {
    body: Joi.object({
        art: Joi.string()
            .required()
    }),
};

router.post('', auth, validate(artValidation, {}, {}), async (req, res) => {
    let request = req.body;
    let art = await Art.findOne({ artname: request.artname });
    if (!art) {
        var newArt = new art({
            artname: request.artname,
            createdat: Date.now(),
            createdby: req.sessionUser.username
        });
        newArt.save().then(_ => {
            res.status(200).json({
                status: 200,
                message: "Art created successfully."
            });
        }).catch(err => {
            console.log(err);
            res.status(400).json({
                status: 400,
                message: "Error creating art."
            });
        });
    } else {
        res.status(409).json({
            status: 409,
            message: "The art already exists."
        });
    }
});

router.put('/:id', auth, validate(artValidation, {}, {}), async (req, res) => {
    let id = req.params.id;
    let request = req.body;
    var art = await Art.findById(id).catch(err => {
        console.log(err);
        res.status(500).json({
            status: 500,
            message: "Error finding art."
        });
    });
    if (!art) res.status(404).json({
        status: 404,
        message: "Art not found"
    });
    else {
        await Art.findByIdAndUpdate(id, {
            artname: request.artname,
            updatedat: Date.now(),
            updatedby: req.sessionUser.username
        }).then(_ => {
            res.status(200).json({
                status: 200,
                message: "Art updated successfully."
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                status: 500,
                message: "Error updating art details."
            });
        });
    }
});

router.get('', reqverify, auth, async (req, res) => {
    var arts = await Art.find({ active: true }).catch(err => {
        console.log(err);
        res.status(500).json({
            status: 500,
            message: "Error fetching list of arts."
        });
    });
    res.status(200).json({
        status: 200,
        message: "Success",
        data: arts
    });
});

router.get('/:id', auth, async (req, res) => {
    let id = req.params.id;
    var art = await Art.findById(id).catch(err => {
        console.log(err);
        res.status(500).json({
            status: 500,
            message: "Error finding art."
        });
    });
    if (!art) res.status(404).json({
        status: 404,
        message: "Art not found"
    });
    else res.status(200).json({
        status: 200,
        message: "Art found",
        data: art
    });
});

/// Here we are doing only a soft delete on the course collection.
router.delete('/:id', auth, async (req, res) => {
    let id = req.params.id;
    await Art.findByIdAndUpdate(id, {
        active: false,
        updatedat: Date.now(),
        updatedby: req.sessionUser.username
    }).then(_ => {
        res.status(200).json({
            status: 200,
            message: "Deleted Art successfully."
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            status: 500,
            message: "Error deleting Art."
        });
    });
});

module.exports = router;