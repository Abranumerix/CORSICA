const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const Comment = require ("../models/Comment")
const auth = require("../middlewares/auth")

router.post("/new-article", auth, async (req, res) => {
    try {
        //on stocke les valeurs récupérées dans le body de la reqsuête, envoyées depuis le front, dans un objet de type Post
        const article = new Article(req.body);
        //on persiste le post dans la bdd. La méthode save() nous retourne une copie de post, stockée dans newPost
        const newArticle = await article.save();
        console.log("création réussie");
        //on envoie une réponse vers le front pour dire que tout s'est bien passé, ainsi que le post lui même, stocké dans la réponse
        return res
            .status(201)
            .json({ message: `l'article ${newArticle.title} a été créé`, status: 201, article: newArticle });
    } catch (error) {
        return res
            .status(500)
            .json({ message: error.message, status: 500 })
    }
});

//récupérer tous les posts
router.get("/", async (req, res) => {
    try {
        const articleList = await Article.find().sort("-createdAt");
        res.status(200).json(articleList);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

//récupérer un post par son id
router.get("/:id", async (req, res) => {
    try {
        const articleId = await Article.findById(req.params.id)
        res.status(200).json(articleId)
    } catch (error) {
        res.json(error.message)
    }
});

//supprimer un post
router.delete("/delete/:id", auth, async (req, res) => {

// Je récupère dans un premier temps l'ID, puis je remove une fois qu'il est trouvé
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(400).json({status: 400, message: "cet article n'existe pas"})
        }
        //Si on veut que seul l'auteur puisse supprimer son article, c'est ici qu'il faut mettre  une condition de test
        await Comment.deleteMany({article: req.params.id}) // PERMET DE SUPPRIMER LE COMMENTAIRE LIÉ A L'ARTICLE
        await article.remove();
        return res
        .status(200).json({status: 200, message: "article supprimé"})
    } catch (error) {
        res.status(500).json(error.message)
    }
});

//mettre à jour un post
router.put("/update/:id", auth, async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(400).json({status: 400, message: "cet article n'existe pas"})
        }
        //Si on veut que seul l'auteur puisse supprimer son articl, c'est ici qu'il faut mettre  une condition de test
        await article.updateOne(req.body);
        return res
        .status(200).json({status: 200, message: "article mis à jour"})
    } catch (error) {
        res.status(500).json(error.message)
    }
});

module.exports = router;