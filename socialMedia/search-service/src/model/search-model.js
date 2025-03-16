const mongoose = require('mongoose');

const SearchSchema = new mongoose.Schema(
    {
        PostId: {  
            type: String,
            required: true,
            unique: true,
        },       
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        content: {
            type: String,
            required: true,
          },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

SearchSchema.index({ content: 'text' });
SearchSchema.index({createdAt:-1});

const Search = mongoose.model('searches', SearchSchema);

module.exports = Search;