import express from "express"
import bodyParser from "body-parser"
import Questions from "./src/questions.js"
import Games from "./src/games.js"

const app = express()
const port = 3000
const MAX_PLAYERS = 30

app.use(bodyParser.json())

let games: Game[] = Games
let questions: Question[] = Questions 
let lobbies: Map<string, Lobby> = new Map()

// General error message
app.get('/', (_, res) => {
    res.json({error: "Invalid endpoint. Please use /games for an overview of existing games."})
})

// Retrieves all games
app.get('/games', (_, res) => {
    const Games = JSON.stringify(games);
    res.json(Games);
})

// Retrieves all questions
app.get('/questions', (_, res) => {
    const Questions = JSON.stringify(questions);
    res.json(Questions);
})

// Creates a new lobby
app.post('/lobby', (_, res) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let id = ''

    for (let i = 0; i < 6; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    lobbies.set(id, { status: "inlobby", players: [] })
    res.json(id)
})

// Joins a new lobby
app.put('/lobby', (req, res) => {
    const id = checkBody(req, res)
    if (!id) return

    const { name } = req.body
    if (!name) {
        return res.status(404).json("Missing name.")
    }

    
    const lobby = lobbies.get(id.toUpperCase()) as Lobby

    if (lobby.players.length >= MAX_PLAYERS) {
        return res.status(409).json("Full lobby.")
    }

    const updatedLobby = {...lobby, players: [...lobby?.players, name]}
    lobbies.set(id.toUpperCase(), updatedLobby)

    res.json(updatedLobby)
})

// Fetches the information for the specified lobby
app.get('/lobby/:id', (req, res) => {
    const { id } = req.params

    const game = lobbies.get(id) as Lobby
    const custom = game?.questions || []
    const mergedQuestions = [...custom, ...questions]
    const current = game?.current ? mergedQuestions[game?.current] : 0

    res.json({
        players: game.players,
        status: game?.status,
        current,
        questions: game.questions
    })
})

// Goes to the next question
app.put('/game', (req, res) => {
    const id = checkBody(req, res)
    if (!id) return

    const game = lobbies.get(id) as Lobby
    const custom = game?.questions || []
    const mergedQuestions = [...custom, ...questions]
    const current = game?.current || 0
    const next = current + 1 < mergedQuestions.length ? current + 1 : 0

    res.json({
        players: game.players,
        status: game?.status,
        current: next
    })
})

// Deletes game
app.delete('/lobby', (req, res) => {
    const id = checkBody(req, res)
    if (!id) return

    lobbies.delete(id)
    res.status(201)
})

// Removes player from game
app.put('/kick', (req, res) => {
    const id = checkBody(req, res)
    if (!id) return

    const { name } = req.body

    if (!name) {
        return res.status(404).json("You must specify the player to kick using the name parameter.")
    }

    const game = lobbies.get(id) as Lobby
    const players = []

    for (const player of game.players) {
        if (player === name) continue
        players.push(player)
    }

    lobbies.set(id, {...game, players})
    res.json({ players })
})

// Starts the API
app.listen(port, () => {
    console.log(`API is running on port ${port}`)
})

// Checks that the body has the required parameters
function checkBody(req: any, res: any): string | null {
    const { id } = req.body

    if (!id) {
        res.status(404).json("Missing id.")
        return null
    }

    if (!lobbies.has(id)) {
        res.status(404).json(`There is no game with ID ${id}`)
        return null
    }

    return id
}

// GET endpoint kort
// - spill id
// Genererer ett random tall mellom 1-14 og sender til frontend (må generere nytt 
// når tiden har gått ut og resultatet har blitt vist)

// PUT endpoint kort
// - spill id
// - navn
// Endepunkt hvor spilleren sender over / under til

// GET endpoint resultat
// - spill id
// - navn
// Endepunkt som viser resultatet når tiden har gått ut (frontenden må fetche
// dette hvert sekund ish). Må sjekke navn mot de som har kommet inn og vise
// resultat for det navnet. Hvis navnet ikke finnes bør det alltid være feil, 
// da svarte de ikke før tiden gikk ut
