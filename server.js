// server.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Route to fetch news by category with extra message query parameter
app.get('/api/category-news', async (req, res) => {
    const { category } = req.query;

    // Extra query parameters to include in the API URL
    const extraParams = 'language=en&sortBy=publishedAt'; // Fixed extra params
    const additionalMessage = encodeURIComponent('120 words of each news'); // Message you want to send

    try {
        // Construct the API URL with the additional message
        const apiUrl = `https://api.gemini.com/v1/news/search?category=${category}&${extraParams}&message=${additionalMessage}&apiKey=${GEMINI_API_KEY}`;

        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.status === 'ok') {
            res.json({ articles: data.articles });
        } else {
            res.status(500).json({ error: 'Failed to fetch category-based news' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch category-based news' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
