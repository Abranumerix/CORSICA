const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const auth = require("../middlewares/auth");
const Article = require ("../models/Article")

//création d'une catégorie
router.post("/new", async(req, res)=> {
    try {
        //on stocke les valeurs récupérées dans le body de la reqsuête, envoyées depuis le front, dans un objet de type Post
        const category = new Category(req.body);
        //on persiste l'article dans la bdd. La méthode save() nous retourne une copie d'article, stockée dans newCategory
        const newCategory = await category.save();
        console.log(req.body);
        console.log("création réussie");
        //on envoie une réponse vers le front pour dire que tout s'est bien passé, ainsi que le Post lui même, stocké dans la réponse
        return res
            .status(201)
            .json({message: `la catégory ${newCategory.title} a été créé`, status: 201, category: newCategory});
    
        } catch(error) {
        return res
            .status(500)
            .json({message: error.message, status: 500})
    }
    }
);

//récupérer toutes les catégories
router.get("/", async(req, res) => {
    try {
        const result = await Category.find().sort("-createdAt");
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error.message);
    }
})

//récupérer une catégorie par son id
router.get("/:id", async(req, res) => {
    try {
        const category = await Category.findById(req.params.id)
        res.status(200).json(category)
    } catch (error) {
        res.json(error.message)
    }
})

//supprimer une category
router.delete("/delete/:id", auth, async(req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if(!category) {
            return res.status(404).json({statut: 404, message: "cette catégorie n'existe pas"});
        }
        //todo si on veut que seul l'auteur puisse supprimer son article c'est ici qu'il faut mettre une condition de test
        await category.remove();
        return res
        .status(200).json({statut: 200, message: "article supprimé"})
    } catch (error) {
        res.status(500).json(error.message)
    }
})

//mettre à jour une categorie
router.put("/update/:id", auth, async(req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if(!category) {
            return res.status(404).json({statut: 404, message: "cette catégorie n'existe pas"});
        }
        //todo si on veut que seul l'auteur puisse mettre à jour son article c'est ici qu'il faut mettre une condition de test. Ici cette sécurisation a été mise en place côté front (voire client\src\app\components\edit-user\edit-user.component.ts)
        await category.updateOne(req.body);
        return res
        .status(200).json({statut: 200, message: "catégorie mise à jour"})
    } catch (error) {
        res.status(500).json(error.message)
    }
})

//relier un article à la catégorie
router.put("/:id/addArticle/:articleId", auth, async(req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);
        const articleId = req.params.articleId;
        if(!category.articles.includes(articleId)){
            const categoryAdd = await Category.updateOne(
                {_id: categoryId},
                { $push: { articles: req.body.articleId}}
            );
        }
        return res.status(200)
    } catch (error) {
        console.error(error.message);
    }
})

//séparer un article de la catégorie
router.put("/:id/removeArticle/:articleId", auth, async(req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);
        const articleId = req.params.articleId;
        if(category.articles.includes(articleId)){
            const categoryRemove = await Category.updateOne(
                {_id: categoryId},
                { $pull: { articles: req.body.articleId}}
            );
        }
        return res.status(200)
    } catch (error) {
        console.error(error.message);
    }
})

module.exports = router;