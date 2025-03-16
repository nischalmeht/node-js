const Search = require("../model/search-model");

const search = async (req, res) => {
    try {
        const { query } = req.body;

        // Log the query for debugging
        logger.info(`Search query received: ${query}`);

        const results = await Search(
            {
                $text: { $search: query },
            },
            {
                score: { $meta: "textScore" },
            }
        )
            .sort({ score: { $meta: "textScore" } })
            .limit(10);
            
        // Handle empty results
        if (!results || results.length === 0) {
            logger.warn("No results found for the given query");
            return res.status(404).json({ message: "No results found" });
        }

        res.status(200).json({ results });
    } catch (error) {
        logger.error("Error while searching post", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = search;