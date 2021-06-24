const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore')
const mostRecentScore = localStorage.getItem('mostRecentScore');

const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

finalScore.innerText = mostRecentScore;

username.addEventListener('keyup', () => {
    console.log(username.value);
    saveScoreBtn.disabled = !username.value;
});



saveHighScore = e => {
    e.preventDefault();
    console.log("clicked save button");

    const score = {
        score: Math.floor(Math.random() * 100),
        name: username.value
    };

    highScores.push(score);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(5);

    localStorage.setItem('highScores', JSON.stringify(highScores));
    window.location.assign('/');
};