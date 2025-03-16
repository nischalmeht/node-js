const Search = require("../model/search-model");
const logger = require("../utils/logger");

async function handleSearchEvent(event) {
    try {
        console.log(event)
        const newSearch = new Search({
            PostId: event.postId,
            userId: event.userId,   
            content: event.content,
            createdAt: event.createdAt
        });
        await newSearch.save();
        console.log(newSearch,'newSearch')
        logger.info("Search event processed successfully", newSearch);
    } catch (error) {
        logger.error("Error while processing search event", error);
    }
}
module.exports = { handleSearchEvent };