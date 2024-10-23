import express from "express";
import bodyParser from "body-parser";
import Questions from "./src/questions.js";
import Games from "./src/games.js";
const app = express();
const port = 3000;
app.use(bodyParser.json());
let games = Games;
let questions = Questions;
let lobbies = new Map();
// General error message
app.get('/', (_, res) => {
    res.json({ error: "Invalid endpoint. Please use /games for an overview of existing games." });
});
// Retrieves all games
app.get('/games', (_, res) => {
    const Games = JSON.stringify(games);
    res.json(Games);
});
// Retrieves all questions
app.get('/questions', (_, res) => {
    const Questions = JSON.stringify(questions);
    res.json(Questions);
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
// Joins a new lobby
app.put('/lobby', (req, res) => {
    const id = checkBody(req, res);
    if (!id)
        return;
    const { name } = req.body;
    if (!name) {
        return res.status(404).json("Missing name.");
    }
    const game = lobbies.get(id);
    const updatedLobby = Object.assign(Object.assign({}, game), { players: [...game === null || game === void 0 ? void 0 : game.players, name] });
    lobbies.set(id, updatedLobby);
    res.json(updatedLobby);
});
// Fetches the information for the specified lobby
app.get('/lobby/:id', (req, res) => {
    const { id } = req.params;
    const game = lobbies.get(id);
    const custom = (game === null || game === void 0 ? void 0 : game.questions) || [];
    const mergedQuestions = [...custom, ...questions];
    const current = (game === null || game === void 0 ? void 0 : game.current) ? mergedQuestions[game === null || game === void 0 ? void 0 : game.current] : 0;
    res.json({
        players: game.players,
        status: game === null || game === void 0 ? void 0 : game.status,
        current,
        questions: game.questions
    });
});
// Goes to the next question
app.put('/game', (req, res) => {
    const id = checkBody(req, res);
    if (!id)
        return;
    const game = lobbies.get(id);
    const custom = (game === null || game === void 0 ? void 0 : game.questions) || [];
    const mergedQuestions = [...custom, ...questions];
    const current = (game === null || game === void 0 ? void 0 : game.current) || 0;
    const next = current + 1 < mergedQuestions.length ? current + 1 : 0;
    res.json({
        players: game.players,
        status: game === null || game === void 0 ? void 0 : game.status,
        current: next
    });
});
// Deletes game
app.delete('/lobby', (req, res) => {
    const id = checkBody(req, res);
    if (!id)
        return;
    lobbies.delete(id);
    res.status(201);
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
// Starts the API
app.listen(port, () => {
    console.log(`API is running on port ${port}`);
});
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
