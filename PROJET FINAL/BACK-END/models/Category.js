const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            require: true
        },
        content: {
            type: String,
        },
        articles: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Article"
        }]
    },
    {
        timestamps: true
    }
);
module.exports = mongoose.model("Category", categorySchema);