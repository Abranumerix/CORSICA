const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment")
const auth = require("../middlewares/auth")

router.post("/new-comment", auth, async (req, res) => {
    try {
        const comment = new Comment(req.body);
        const newComment = await comment.save();
        res.status(201)
            .json({ message: `le commentaire ${newComment.title} a été créé`, comment: newComment })
    } catch (error) {
        res.status(500)
            .json(error.message)
    }
});

router.get("/", async (req, res) => {
    try {
        const commentList = await Comment.find().sort("-createdAt");
        res.status(200).json({ status: 200, result: commentList });
    } catch (error) {
        res.status(500).json(error.message)
    }
});

router.get("/:id", async (req, res) => {
    try {
        const commentId = await Comment.findById(req.params.id)
        if (!commentId) {
            return res
                .status(400)
                .json({ message: `ce commentaire n'existe pas`, status: 400 })
        } else {
            res.status(200).json({ status: 200, result: commentId })
        }
    } catch (error) {
        res.status(500).json(error.message)
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "le commentaire à bien été supprimé" })
    } catch (error) {
        res.status(500).json(error.message)
    }
});

router.put("/update/:id", async (req, res) => {

    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(400).json({status: 400, message: "ce commentaire n'existe pas"})
        }
        //Si on veut que seul l'auteur puisse supprimer son articl, c'est ici qu'il faut mettre  une condition de test
        await comment.updateOne(req.body);
        return res
        .status(200).json({status: 200, message: "commentaire mis à jour"})
    } catch (error) {
        res.status(500).json(error.message)
    }
});

module.exports = router;