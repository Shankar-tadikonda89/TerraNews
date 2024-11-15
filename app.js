// Check if the user is authenticated
function checkAuth() {
    const token = sessionStorage.getItem("token");
    if (!token) {
        alert("Please log in first!");
        window.location.href = "index.html";
    }
}

// Execute authentication check on page load
document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
    getCategoryNews('sports'); // Default to sports news
});

// Fetch and display category-based news
async function getCategoryNews(category) {
    const apiUrl = `/api/category-news?category=${category}`;

    try {
        let response = await fetch(apiUrl);
        let data = await response.json();
        displayNews(data.articles, "category-news");
    } catch (error) {
        alert("Failed to fetch news for this category.");
    }
}

// Display news articles
function displayNews(articles, elementId) {
    const container = document.getElementById(elementId);
    container.innerHTML = ""; // Clear previous results

    articles.forEach(article => {
        let newsItem = document.createElement("div");
        newsItem.className = "news-item";
        newsItem.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.description || "No description available."}</p>
            <a href="${article.url}" target="_blank">Read more</a>
        `;
        container.appendChild(newsItem);
    });
}

// Sign out function
function signOut() {
    sessionStorage.removeItem("token");
    alert("You have been signed out.");
    window.location.href = "index.html";
}
