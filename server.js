const express = require('express');
const { google } = require('googleapis');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// OAuth Configuration
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = 'https://terra-news.vercel.app/auth/callback';

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Serve Static Files (HTML)
app.use(express.static('public'));

// Step 1: Login Route
app.get('/auth/login', (req, res) => {
    const scopes = [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ];

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });

    res.redirect(authUrl);
});

// Step 2: OAuth Callback Route
app.get('/auth/callback', async (req, res) => {
    const code = req.query.code;

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2'
        });

        const userInfo = await oauth2.userinfo.get();

        // Store user data temporarily for demo purposes
        const { name, email } = userInfo.data;

        res.redirect(`/news.html?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`);
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).send('Authentication failed.');
    }
});

// Step 3: Location-Based News Retrieval
app.get('/fetch-news', async (req, res) => {
    const { latitude, longitude, category } = req.query;

    // Example Gemini API URL
    const geminiApiUrl = `https://api.gemini.com/v1/news`;

    try {
        const response = await axios.get(geminiApiUrl, {
            params: {
                latitude,
                longitude,
                category,
                message: "120 words each" // Add the extra message here
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).send('Failed to fetch news.');
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
