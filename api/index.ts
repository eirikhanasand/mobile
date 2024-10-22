import express from "express"
import bodyParser from "body-parser"
import Questions from "./src/questions.js"
import Games from "./src/games.js"

const app = express()
const port = 3000

app.use(bodyParser.json())

let games: Game[] = Games
let questions: Question[] = Questions 

// General error message
app.get('/', (_, res) => {
    res.json({error: "Invalid endpoint. Please use /games for an overview of existing games."})
})

// Retrieves all games
app.get('/games', (_, res) => {
    const Games = JSON.stringify(games);
    res.header("Content-Type", "application/json");
    res.send(Games);
})

// Retrieves all questions
app.get('/questions', (_, res) => {
    const Questions = JSON.stringify(questions);
    res.header("Content-Type", "application/json");
    res.send(Questions);
})

// Starts the API
app.listen(port, () => {
    console.log(`API is running on port ${port}`)
})
