document.addEventListener('DOMContentLoaded', function () {
    const gameContainer = document.getElementById('gameContainer');
    const player = document.getElementById('player');
    const startGameButton = document.getElementById('startGameButton');
    const restartGameButton = document.getElementById('restartGameButton');
    const scoreDisplay = document.getElementById('score');
    const openingSlideshow = document.getElementById('openingSlideshow');
    const loadingMessage = document.getElementById('loadingMessage');
    const endingVideo = document.getElementById('endingVideo');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const endMessage = document.getElementById('endMessage');
    
    let score = 0;
    let gameInterval;
    let alienSpawnInterval;
    let isGameRunning = false;
    
    function startGame() {
        openingSlideshow.style.display = 'none';
        startGameButton.style.display = 'none';
        score = 0;
        scoreDisplay.textContent = 'Score: 0';
        isGameRunning = true;
        gameInterval = setInterval(gameLoop, 1000 / 60); // 60 fps
        alienSpawnInterval = setInterval(spawnAlien, 1000);
    }
    
    function endGame() {
        clearInterval(gameInterval);
        clearInterval(alienSpawnInterval);
        isGameRunning = false;
        restartGameButton.style.display = 'block';
        endingVideo.style.display = 'block';
        endMessage.style.display = 'block';
        backgroundMusic.pause();
    }
    
    function restartGame() {
        endingVideo.style.display = 'none';
        endMessage.style.display = 'none';
        restartGameButton.style.display = 'none';
        startGame();
    }
    
    function gameLoop() {
        moveBullets();
        moveAliens();
        checkCollisions();
    }
    
    function spawnBullet() {
        const bullet = document.createElement('div');
        bullet.className = 'bullet';
        const playerRect = player.getBoundingClientRect();
        bullet.style.left = (playerRect.left + playerRect.width / 2 - 5 - 10) + 'px'; // 10 פיקסלים שמאלה
        bullet.style.bottom = (window.innerHeight - playerRect.top) + 'px';
        gameContainer.appendChild(bullet);
    }
    
    function moveBullets() {
        const bullets = document.querySelectorAll('.bullet');
        bullets.forEach(bullet => {
            const bulletBottom = parseFloat(bullet.style.bottom);
            bullet.style.bottom = (bulletBottom + 10) + 'px';
            if (bulletBottom > window.innerHeight) {
                bullet.remove();
            }
        });
    }
    
    function spawnAlien() {
        const alien = document.createElement('div');
        alien.className = 'alien';
        alien.style.left = Math.random() * (window.innerWidth - 75) + 'px';
        alien.style.top = '0px';
        gameContainer.appendChild(alien);
    }
    
    function moveAliens() {
        const aliens = document.querySelectorAll('.alien');
        aliens.forEach(alien => {
            const alienTop = parseFloat(alien.style.top);
            alien.style.top = (alienTop + 5) + 'px';
            if (alienTop > window.innerHeight) {
                alien.remove();
                endGame();
            }
        });
    }
    
    function checkCollisions() {
        const bullets = document.querySelectorAll('.bullet');
        const aliens = document.querySelectorAll('.alien');
        bullets.forEach(bullet => {
            const bulletRect = bullet.getBoundingClientRect();
            aliens.forEach(alien => {
                const alienRect = alien.getBoundingClientRect();
                if (bulletRect.left < alienRect.left + alienRect.width &&
                    bulletRect.left + bulletRect.width > alienRect.left &&
                    bulletRect.top < alienRect.top + alienRect.height &&
                    bulletRect.top + bulletRect.height > alienRect.top) {
                    bullet.remove();
                    alien.remove();
                    score += 10;
                    scoreDisplay.textContent = 'Score: ' + score;
                }
            });
        });
    }
    
    document.addEventListener('click', function (event) {
        if (isGameRunning) {
            spawnBullet();
        }
    });
    
    startGameButton.addEventListener('click', function () {
        loadingMessage.style.display = 'block';
        backgroundMusic.play();
        setTimeout(function () {
            openingSlideshow.style.display = 'none';
            loadingMessage.style.display = 'none';
            startGame();
        }, 5000); // המתן 5 שניות עד לסיום טעינת הוידאו
    });
    
    restartGameButton.addEventListener('click', restartGame);
});
