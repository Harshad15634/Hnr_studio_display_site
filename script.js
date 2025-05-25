// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDv6XbD9vQn1Nn2v9Q2w7Xw8Y9Z0a1B2C3D",
    authDomain: "game-display-website.firebaseapp.com",
    databaseURL: "https://game-display-website-default-rtdb.firebaseio.com",
    projectId: "game-display-website",
    storageBucket: "game-display-website.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// DOM elements
const gamesContainer = document.getElementById('games-container');
const gameModal = document.getElementById('game-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.querySelector('.close-modal');

// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Fetch games from Firebase
function fetchGames() {
    database.ref('games').once('value')
        .then((snapshot) => {
            const gamesData = snapshot.val();
            displayGames(gamesData);
        })
        .catch((error) => {
            console.error("Error fetching games: ", error);
            gamesContainer.innerHTML = `
                <div class="error-message">
                    <p>Failed to load games. Please try again later.</p>
                </div>
            `;
        });
}

// Display games in the grid
function displayGames(games) {
    gamesContainer.innerHTML = '';
    
    Object.entries(games).forEach(([gameId, game]) => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
            <img src="${game.imageUrl}" alt="${game.name}">
            <div class="game-info">
                <h3>${game.name}</h3>
            </div>
        `;
        
        gameCard.addEventListener('click', () => {
            showGameDetails(game);
        });
        
        gamesContainer.appendChild(gameCard);
    });
}

// Show game details in modal
function showGameDetails(game) {
    modalBody.innerHTML = `
        <h2 class="modal-game-title">${game.name}</h2>
        
        ${game.youtubeTrailerUrl ? `
        <div class="modal-game-trailer">
            <iframe src="https://www.youtube.com/embed/${getYouTubeId(game.youtubeTrailerUrl)}" 
                    frameborder="0" 
                    allowfullscreen></iframe>
        </div>
        ` : ''}
        
        <div class="modal-actions">
            <a href="${game.playStoreUrl}" class="modal-btn modal-btn-primary" target="_blank">
                <i class="fab fa-google-play"></i> Download
            </a>
            ${game.youtubeTrailerUrl ? `
            <a href="${game.youtubeTrailerUrl}" class="modal-btn modal-btn-secondary" target="_blank">
                <i class="fab fa-youtube"></i> Watch Trailer
            </a>
            ` : ''}
        </div>
    `;
    
    gameModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Helper function to extract YouTube ID from URL
function getYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Close modal
closeModal.addEventListener('click', () => {
    gameModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === gameModal) {
        gameModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Initialize the page
fetchGames();