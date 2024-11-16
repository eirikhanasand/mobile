// Imports express, parser and questions
import express from "express";
import bodyParser from "body-parser";
import Questions from "./questions.js";
// Starts the application
const app = express();
const port = 3000;
const MAX_PLAYERS = 30;
app.use(bodyParser.json());
// Defines global objects that are available
let questions = Questions;
let lobbies = new Map();
let askedQuestions = new Map();
let cards = new Map();
let scores = new Map();
let guesses = new Map();
// 'Lookup table' for number -> type
const numberToType = ['hearts', 'spades', 'clubs', 'diamonds'];
// General error message
app.get('/', (_, res) => {
    res.json({ error: "Invalid endpoint. Please use /games for an overview of existing games." });
});
app.get('/question/:name', (req, res) => {
    var _a;
    const { name } = req.params;
    const { filters, reverse } = req.body;
    if (!name) {
        return res.status(400).json({ error: "You must provide a name so we can avoid giving duplicate questions." });
    }
    let lobby = lobbies.get(name);
    if (!lobby) {
        lobbies.set(name, {
            players: [name],
            status: 'ingame',
            current: undefined,
            questions: undefined
        });
    }
    lobby = lobbies.get(name);
    if (!lobby) {
        return res.status(400).json({ error: "Could not find nor create lobby. Try the POST /lobby endpoint first." });
    }
    const { question, asked, randomID } = getQuestion(lobby, name, filters, reverse);
    if (question) {
        const title_no = replacePlaceholders(question.title_no, lobby.players);
        const title_en = replacePlaceholders(question.title_en, lobby.players);
        const current = {
            title_no,
            title_en,
            categories: question.categories
        };
        // Skips custom questions since these are deleted upon usage
        if (!((_a = lobby.questions) === null || _a === void 0 ? void 0 : _a.length)) {
            askedQuestions.set(name, [...asked, randomID]);
        }
        const updatedLobby = Object.assign(Object.assign({}, lobby), { current });
        lobbies.set(name.toUpperCase(), updatedLobby);
        res.json({
            players: lobby.players,
            status: lobby === null || lobby === void 0 ? void 0 : lobby.status,
            current,
        });
    }
    else {
        askedQuestions.delete(name);
        const { question } = getQuestion(lobby, name, filters, reverse);
        res.status(201).json({
            players: lobby.players,
            status: lobby === null || lobby === void 0 ? void 0 : lobby.status,
            current: question,
        });
    }
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
// Sets the status of the lobby
app.get('/status/:id/:status', (req, res) => {
    const { id, status } = req.params;
    const lobby = lobbies.get(id);
    const valid = ["inlobby", "ingame", "waiting", "cards"];
    if (!valid.includes(status)) {
        res.json({ result: `Failure, invalid status "${status}" not in ${valid.join()}.` });
    }
    if (!lobby) {
        lobbies.set(id, {
            players: [],
            status: 'cards',
            current: undefined,
            questions: undefined
        });
    }
    else {
        lobbies.set(id, Object.assign(Object.assign({}, lobby), { status: status }));
    }
    res.json({ result: "success" });
});
// Fetches the card for a given lobby
app.get('/card/:id', (req, res) => {
    const { id } = req.params;
    if (!id)
        return;
    const card = cards.get(id);
    // Creates a new card if there is no card for the current lobby
    if (!card) {
        const number = Math.floor(Math.random() * 12) + 2;
        const randomType = Math.floor((Math.random() * 100) % 4);
        const newCard = { number, type: numberToType[randomType], time: new Date().getTime() };
        cards.set(id, [newCard]);
        return res.json(Object.assign({}, newCard));
    }
    const currentCard = card[card.length - 1];
    // Creates a new card if the existing card is older than 30 seconds
    if (new Date().getTime() - new Date(currentCard.time).getTime() > 30000) {
        let number = currentCard.number;
        let newNumber = Math.floor(Math.random() * 12) + 2;
        while (number === newNumber) {
            newNumber = Math.floor(Math.random() * 12) + 2;
        }
        const randomType = Math.floor((Math.random() * 100) % 4);
        const newCard = { number: newNumber, type: numberToType[randomType], time: new Date().getTime() };
        cards.set(id, [...card, newCard]);
        return res.json(Object.assign({}, newCard));
    }
    return res.json(Object.assign({}, currentCard));
});
// Fetches the scores for a given lobby
app.get('/scores/:id', (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "id missing in the URL." });
    }
    const lobbyGuesses = guesses.get(id);
    if (!lobbyGuesses) {
        return res.status(503).json({ error: "No guesses yet." });
    }
    const card = cards.get(id);
    if (!card) {
        return res.status(503).json({ error: "Waiting for round to start." });
    }
    if (card.length < 2) {
        updateCard({ id, card });
        return res.status(503).json({ error: "Waiting for next card." });
    }
    const currentCard = card[card.length - 1];
    const previousCard = card[card.length - 2];
    let activeCard = card;
    const lobbyScores = scores.get(id);
    if (!lobbyScores) {
        updateCard({ id, card });
        if (currentCard.number !== previousCard.number) {
            const updatedScores = calculateScores(activeCard, lobbyGuesses, []);
            if (new Date().getTime() - new Date(previousCard.time).getTime() > 30000) {
                scores.set(id, updatedScores);
                guesses.set(id, []);
            }
            return res.json(updatedScores);
        }
        return res.json(lobbyScores);
    }
    if (currentCard.number !== previousCard.number && (new Date().getTime() - new Date(previousCard.time).getTime() > 59000)) {
        updateCard({ id, card });
        const newCard = cards.get(id);
        const updatedScores = calculateScores(newCard, lobbyGuesses, lobbyScores);
        scores.set(id, updatedScores);
        guesses.set(id, []);
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
// Posts a guess for the next card in the specificed lobby
app.post('/card/:id/:name/:guess', (req, res) => {
    const { id, name, guess } = req.params;
    if (!id || !name || !guess) {
        return res.status(400).json({ error: "id or guess parameter missing in the URL." });
    }
    const lobbyGuesses = guesses.get(id);
    if (!lobbyGuesses) {
        const value = guess === "1" || guess === "0";
        if (!value) {
            return res.status(400).json({ error: "You must guess either 0 (down) or 1 (up)" });
        }
        guesses.set(id, [{ name, value: guess === "1" ? true : false }]);
        return res.status(200).json({ "result": `Successfully guessed ${guess === '1' ? 'up' : 'down'}.` });
    }
    const existingGuesses = Object.values(lobbyGuesses);
    for (const existingGuess of existingGuesses) {
        if (existingGuess.name === name) {
            return res.status(409).json({ "result": `You have already guessed ${existingGuess.value === true ? 'up' : 'down'}.` });
        }
    }
    lobbyGuesses.push({ name, value: guess === "1" ? true : false });
    return res.status(200).json({ "result": `Successfully guessed ${guess === '1' ? 'up' : 'down'}` });
});
// Posts a custom question
app.post('/question/:id', (req, res) => {
    const { id } = req.params;
    const { title_no, title_en, categories } = req.body;
    if (!id || !title_no || !title_en || !categories) {
        return res.status(400).json("Missing ID, title_no, title_en or categories.");
    }
    const lobby = lobbies.get(id);
    if (!lobby) {
        return res.status(400).json("Lobby doesnt exist");
    }
    lobbies.set(id, Object.assign(Object.assign({}, lobby), { questions: Array.isArray(lobby.questions)
            ? [...lobby.questions, { title_no, title_en, categories }]
            : [{ title_no, title_en, categories }] }));
    return res.status(200).json({ "result": "Added question" });
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
    var _a;
    const { id } = req.params;
    const { filters, reverse } = req.body;
    if (!lobbies.has(id)) {
        return res.status(404).json({
            error: `Failed to go to the next question. Lobby ${id} does not exist`
        });
    }
    const lobby = lobbies.get(id);
    const { question, asked, randomID } = getQuestion(lobby, id, filters, reverse);
    if (question) {
        const title_no = replacePlaceholders(question.title_no, lobby.players);
        const title_en = replacePlaceholders(question.title_en, lobby.players);
        const current = {
            title_no,
            title_en,
            categories: question.categories
        };
        // Skips custom questions since these are deleted upon usage
        if (!((_a = lobby.questions) === null || _a === void 0 ? void 0 : _a.length)) {
            askedQuestions.set(id, [...asked, randomID]);
        }
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
        const { question } = getQuestion(lobby, id, filters, reverse);
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
    const { filter, reverse } = req.body;
    if (!lobbies.has(id)) {
        return res.status(404).json({
            error: `Failed to reset questions. Lobby ${id} does not exist.`
        });
    }
    askedQuestions.delete(id);
    const lobby = lobbies.get(id);
    const { question, asked, randomID } = getQuestion(lobby, id, filter, reverse);
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
function getQuestion(lobby, id, filter, reverseFilter) {
    const custom = (lobby === null || lobby === void 0 ? void 0 : lobby.questions) || [];
    const mergedQuestions = [...custom, ...questions];
    let randomID;
    let question;
    const asked = askedQuestions.get(id) || [];
    do {
        // Takes custom questions first
        randomID = Math.floor(Math.random() * (custom.length > 0 ? custom.length : 100));
        question = mergedQuestions[randomID];
        // Deletes custom questions
        if (custom.length) {
            lobbies.set(id, Object.assign(Object.assign({}, lobby), { questions: removeQuestion(custom, question) }));
        }
    } while (asked.includes(randomID) && asked.length < 100 && (!filter || comp(question.categories, filter, reverseFilter)));
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
// Replacec {player} with the actual player name
function replacePlaceholders(question, players) {
    return question.replace(/{player}/g, () => {
        const randomIndex = Math.floor(Math.random() * players.length);
        return players[randomIndex];
    });
}
// Calculates new scores based on given guesses
function calculateScores(card, guesses, scores) {
    const length = card.length;
    const previousCardNumber = length > 1 ? card[length - 2].number : undefined;
    const currentCard = card[length - 1].number;
    if (!previousCardNumber) {
        for (const guess of guesses) {
            scores = defineUserScore(scores, guess.name);
        }
        return scores;
    }
    const higher = previousCardNumber < currentCard;
    for (const guess of guesses) {
        if (higher && guess.value) {
            scores = updateUser(scores, guess.name);
        }
        else if (!higher && !guess.value) {
            scores = updateUser(scores, guess.name);
        }
        else {
            defineUserScore(scores, guess.name);
        }
    }
    return scores;
}
// Updates a users score
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
// Defines a users score
function defineUserScore(scores, name) {
    for (let i = 0; i < scores.length; i++) {
        if (scores[i].name === name) {
            return scores;
        }
    }
    scores.push({ name, score: 0 });
    return scores;
}
// Updates the card
function updateCard({ id, card }) {
    const currentCard = card[card.length - 1];
    if (new Date().getTime() - new Date(currentCard.time).getTime() > 30000) {
        let number = currentCard.number;
        let newNumber = Math.floor(Math.random() * 12) + 2;
        while (number === newNumber) {
            newNumber = Math.floor(Math.random() * 12) + 2;
        }
        const randomType = Math.floor((Math.random() * 100) % 4);
        cards.set(id, [...card, { number: newNumber, type: numberToType[randomType], time: new Date().getTime() }]);
    }
}
// Compares two lists, True if both lists contain at least one duplicate, otherwise false
// If reversed, false if there are duplicates, otherwise true
function comp(a, b, reverse) {
    for (const item of a) {
        if (b.includes(item)) {
            return reverse ? false : true;
        }
    }
    return reverse ? true : false;
}
// Removes an question from the array of questions
function removeQuestion(array, element) {
    const newArray = [];
    for (const item of array) {
        if (item.title_no === element.title_no) {
            continue;
        }
        newArray.push(item);
    }
    return newArray;
}
