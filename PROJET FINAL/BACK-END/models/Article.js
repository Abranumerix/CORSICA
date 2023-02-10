const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: "User"
        },
        title: {
            type: String,
            require: true,
        },
        content: {
            type: String,
            require: true,
        },
        category: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        }],
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Article", articleSchema);

