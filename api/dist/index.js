import express from "express";
import bodyParser from "body-parser";
import Questions from "./questions.js";
const app = express();
const port = 3000;
const MAX_PLAYERS = 30;
app.use(bodyParser.json());
let questions = Questions;
let lobbies = new Map();
let askedQuestions = new Map();
let cards = new Map();
let previousCards = new Map();
let scores = new Map();
let guesses = new Map();
// General error message
app.get('/', (_, res) => {
    res.json({ error: "Invalid endpoint. Please use /games for an overview of existing games." });
});
// Fetches the information for the specified lobby
app.get('/lobby/:id', (req, res) => {
    const { id } = req.params;
    const game = lobbies.get(id);
    const current = (game === null || game === void 0 ? void 0 : game.current) ? game === null || game === void 0 ? void 0 : game.current : null;
    if (!game) {
        return res.json({
            players: [],
            status: 'pending',
            current,
            questions: null
        });
    }
    res.json({
        players: game.players,
        status: game === null || game === void 0 ? void 0 : game.status,
        current,
        questions: game.questions
    });
});
app.get('/card/:id', (req, res) => {
    const { id } = req.params;
    if (!id)
        return;
    const card = cards.get(id);
    // Creates a new card if there is no card for the current lobby
    if (!card) {
        const number = Math.floor(Math.random() * 12) + 2;
        cards.set(id, [{ number, time: new Date().getTime() }]);
        return res.json({ card: number });
    }
    const currentCard = card[card.length - 1];
    // Creates a new card if the existing card is older than 30 seconds
    if (new Date().getTime() - new Date(currentCard.time).getTime() > 30000) {
        let number = currentCard.number;
        let newNumber = Math.floor(Math.random() * 12) + 2;
        while (number === newNumber) {
            newNumber = Math.floor(Math.random() * 12) + 2;
        }
        cards.set(id, [...card, { number: newNumber, time: new Date().getTime() }]);
        return res.json({ card: number });
    }
    return res.json({ card: currentCard.number });
});
app.get('/scores/:id', (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "id missing in the URL." });
    }
    const lobbyGuesses = guesses.get(id);
    if (!lobbyGuesses) {
        return res.status(200).json({ error: "No guesses yet." });
    }
    const card = cards.get(id);
    const previous = previousCards.get(id) || { number: 0 };
    if (!card) {
        return res.status(200).json({ error: "Round not started yet." });
    }
    const currentCard = card[card.length - 1];
    let activeCard = card;
    if (new Date().getTime() - new Date(currentCard.time).getTime() > 30000) {
        let number = currentCard.number;
        let newNumber = Math.floor(Math.random() * 12) + 2;
        while (number === newNumber) {
            newNumber = Math.floor(Math.random() * 12) + 2;
        }
        activeCard = [...card, { number: newNumber, time: new Date().getTime() }];
        cards.set(id, activeCard);
    }
    const lobbyScores = scores.get(id);
    if (!lobbyScores) {
        if (currentCard.number !== previous.number) {
            const updatedScores = calculateScores(activeCard, lobbyGuesses, []);
            scores.set(id, updatedScores);
            previousCards.set(id, currentCard);
            return res.json(updatedScores);
        }
        return res.json(lobbyScores);
    }
    if (currentCard.number !== previous.number || lobbyScores.length < lobbyGuesses.length) {
        const updatedScores = calculateScores(activeCard, lobbyGuesses, lobbyScores);
        scores.set(id, updatedScores);
        previousCards.set(id, currentCard);
        return res.json(updatedScores);
    }
    return res.json(lobbyScores);
});
// Creates a new lobby
app.post('/lobby', (_, res) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < 6; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    lobbies.set(id, { status: "inlobby", players: [] });
    res.json(id);
});
app.post('/card/:id/:name/:guess', (req, res) => {
    const { id, name, guess } = req.params;
    if (!id || !name || !guess) {
        return res.status(400).json({ error: "id or guess parameter missing in the URL." });
    }
    const lobbyGuesses = guesses.get(id);
    if (!lobbyGuesses) {
        const value = Boolean(guess) || -1;
        if (typeof value === 'boolean' && value !== true && value !== 1) {
            res.status(400).json({ error: "You must guess either 0 (down) or 1 (up)" });
        }
        guesses.set(id, [{ name, value: Boolean(guess) }]);
        return res.status(200).json({ "result": `Successfully guessed ${guess === '1' ? 'up' : 'down'}.` });
    }
    const existingGuesses = Object.values(lobbyGuesses);
    for (const existingGuess of existingGuesses) {
        if (existingGuess.name === name) {
            return res.status(409).json({ "result": `You have already guessed ${existingGuess.value === true ? 'up' : 'down'}.` });
        }
    }
    lobbyGuesses.push({ name, value: Boolean(guess) });
    return res.status(200).json({ "result": `Successfully guessed ${guess === '1' ? 'up' : 'down'}` });
});
// Joins a new lobby
app.put('/lobby', (req, res) => {
    const id = checkBody(req, res);
    if (!id)
        return;
    const { name } = req.body;
    if (!name) {
        return res.status(404).json("Missing name.");
    }
    const lobby = lobbies.get(id.toUpperCase());
    if (lobby.players.length >= MAX_PLAYERS) {
        return res.status(409).json("Full lobby.");
    }
    const updatedLobby = Object.assign(Object.assign({}, lobby), { players: [...lobby === null || lobby === void 0 ? void 0 : lobby.players, name] });
    lobbies.set(id.toUpperCase(), updatedLobby);
    res.json(updatedLobby);
});
// Goes to the next question
app.put('/game/:id', (req, res) => {
    const { id } = req.params;
    if (!lobbies.has(id)) {
        return res.status(404).json({
            error: `Failed to go to the next question. Lobby ${id} does not exist`
        });
    }
    const lobby = lobbies.get(id);
    const { question, asked, randomID } = getQuestion(lobby, id);
    if (question) {
        const title_no = replacePlaceholders(question.title_no, lobby.players);
        const title_en = replacePlaceholders(question.title_en, lobby.players);
        const current = {
            title_no,
            title_en,
            categories: question.categories
        };
        askedQuestions.set(id, [...asked, randomID]);
        const updatedLobby = Object.assign(Object.assign({}, lobby), { current });
        lobbies.set(id.toUpperCase(), updatedLobby);
        res.json({
            players: lobby.players,
            status: lobby === null || lobby === void 0 ? void 0 : lobby.status,
            current,
        });
    }
    else {
        askedQuestions.delete(id);
        const { question } = getQuestion(lobby, id);
        res.status(201).json({
            players: lobby.players,
            status: lobby === null || lobby === void 0 ? void 0 : lobby.status,
            current: question,
        });
    }
});
// Removes player from game
app.put('/kick', (req, res) => {
    const id = checkBody(req, res);
    if (!id)
        return;
    const { name } = req.body;
    if (!name) {
        return res.status(404).json("You must specify the player to kick using the name parameter.");
    }
    const game = lobbies.get(id);
    const players = [];
    for (const player of game.players) {
        if (player === name)
            continue;
        players.push(player);
    }
    lobbies.set(id, Object.assign(Object.assign({}, game), { players }));
    res.json({ players });
});
// Resets game
app.delete('/game/:id', (req, res) => {
    const { id } = req.params;
    if (!lobbies.has(id)) {
        return res.status(404).json({
            error: `Failed to reset questions. Lobby ${id} does not exist.`
        });
    }
    askedQuestions.delete(id);
    const lobby = lobbies.get(id);
    const { question, asked, randomID } = getQuestion(lobby, id);
    if (question) {
        const title_no = replacePlaceholders(question.title_no, lobby.players);
        const title_en = replacePlaceholders(question.title_en, lobby.players);
        const current = {
            title_no,
            title_en,
            categories: question.categories
        };
        askedQuestions.set(id, [...asked, randomID]);
        const updatedLobby = Object.assign(Object.assign({}, lobby), { current });
        lobbies.set(id.toUpperCase(), updatedLobby);
        return res.status(201).json({
            players: lobby.players,
            status: lobby === null || lobby === void 0 ? void 0 : lobby.status,
            current,
        });
    }
    res.status(500).json({ message: `Failed to get question after reset. Unknown result.` });
});
// Deletes game
app.delete('/lobby', (req, res) => {
    const id = checkBody(req, res);
    if (!id)
        return;
    if (!lobbies.has(id)) {
        return res.status(404).json({
            error: `Failed to delete, lobby ${id} does not exist`
        });
    }
    lobbies.delete(id);
    res.status(201).json({ message: `Game ${id} has been deleted.` });
});
// Starts the API
app.listen(port, () => {
    console.log(`API is running on port ${port}`);
});
// Fetches the next question
function getQuestion(lobby, id) {
    const custom = (lobby === null || lobby === void 0 ? void 0 : lobby.questions) || [];
    const mergedQuestions = [...custom, ...questions];
    let randomID;
    let question;
    const asked = askedQuestions.get(id) || [];
    do {
        randomID = Math.floor(Math.random() * 100) + 1;
        question = mergedQuestions[randomID];
    } while (asked.includes(randomID) && asked.length < 100);
    return { question, asked, randomID };
}
// Checks that the body has the required parameters
function checkBody(req, res) {
    const { id } = req.body;
    if (!id) {
        res.status(404).json("Missing id.");
        return null;
    }
    if (!lobbies.has(id)) {
        res.status(404).json(`There is no game with ID ${id}`);
        return null;
    }
    return id;
}
function replacePlaceholders(question, players) {
    return question.replace(/{player}/g, () => {
        const randomIndex = Math.floor(Math.random() * players.length);
        return players[randomIndex];
    });
}
function calculateScores(card, guesses, scores) {
    const length = card.length;
    const previousCardNumber = length > 1 ? card[length - 2].number : undefined;
    if (!previousCardNumber) {
        for (const guess of guesses) {
            scores = defineUserScore(scores, guess.name);
        }
        return scores;
    }
    const higher = previousCardNumber < card[length - 1].number;
    for (const guess of guesses) {
        if (higher && guess.value) {
            scores = updateUser(scores, guess.name);
        }
        else if (!higher && !guess.value) {
            scores = updateUser(scores, guess.name);
        }
    }
    return scores;
}
function updateUser(scores, name) {
    for (let i = 0; i < scores.length; i++) {
        if (scores[i].name === name) {
            scores[i] = { name, score: scores[i].score + 10 };
            return scores;
        }
    }
    scores.push({ name, score: 10 });
    return scores;
}
function defineUserScore(scores, name) {
    for (let i = 0; i < scores.length; i++) {
        if (scores[i].name === name) {
            return scores;
        }
    }
    scores.push({ name, score: 0 });
    return scores;
}
