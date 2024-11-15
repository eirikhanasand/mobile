// Imports express, parser and questions
import express from "express"
import bodyParser from "body-parser"
import Questions from "./questions.js"

// Starts the application
const app = express()
const port = 3000
const MAX_PLAYERS = 30
app.use(bodyParser.json())

// Update card function parameters
type UpdateCardProps = {
    id: string
    card: Card[]
}

// Defines global objects that are available
let questions: Question[] = Questions 
let lobbies: Map<string, Lobby> = new Map()
let askedQuestions: Map<string, number[]> = new Map()
let cards: Map<string, Card[]> = new Map()
let scores: Map<string, Score[]> = new Map()
let guesses: Map<string, Guess[]> = new Map()

// General error message
app.get('/', (_, res) => {
    res.json({error: "Invalid endpoint. Please use /games for an overview of existing games."})
})

// Fetches the information for the specified lobby
app.get('/lobby/:id', (req, res) => {
    const { id } = req.params

    const game = lobbies.get(id) as Lobby
    const current = game?.current ? game?.current : null

    if (!game) {
        return res.json({
            players: [],
            status: 'pending',
            current,
            questions: null
        })
    }

    res.json({
        players: game.players,
        status: game?.status,
        current,
        questions: game.questions
    })
})

// Sets the status of the lobby
app.get('/status/:id/:status', (req, res) => {
    const { id, status } = req.params
    const lobby = lobbies.get(id) as Lobby
    const valid = ["inlobby", "ingame", "waiting", "cards"]

    if (!valid.includes(status)) {
        res.json({ result: `Failure, invalid status "${status}" not in ${valid.join()}.` })  
    }
    
    if (!lobby) {
        lobbies.set(id, {
            players: [],
            status: 'cards',
            current: undefined,
            questions: undefined
        })
    } else {
        lobbies.set(id, {...lobby, status: status as any })
    }

    res.json({ result: "success" })    
})

// Fetches the card for a given lobby
app.get('/card/:id', (req, res) => {
    const { id } = req.params
    if (!id) return

    const card = cards.get(id)

    // Creates a new card if there is no card for the current lobby
    if (!card) {
        const number = Math.floor(Math.random() * 12) + 2
        cards.set(id, [{ number, time: new Date().getTime() }])

        return res.json({ card: number })
    }

    const currentCard = card[card.length - 1]

    // Creates a new card if the existing card is older than 30 seconds
    if (new Date().getTime() - new Date(currentCard.time).getTime() > 30000) {
        let number = currentCard.number
        let newNumber = Math.floor(Math.random() * 12) + 2

        while (number === newNumber) {
            newNumber = Math.floor(Math.random() * 12) + 2
        }

        cards.set(id, [...card, { number: newNumber, time: new Date().getTime() }])
        return res.json({ card: number })
    }

    return res.json({ card: currentCard.number })
})

// Fetches the scores for a given lobby
app.get('/scores/:id', (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ error: "id missing in the URL."})
    }

    const lobbyGuesses = guesses.get(id)
    if (!lobbyGuesses) {
        return res.status(503).json({ error: "No guesses yet."})
    }

    const card = cards.get(id)
    if (!card) {
        return res.status(503).json({ error: "Waiting for round to start."})
    }

    if (card.length < 2) {
        updateCard({ id, card})
        return res.status(503).json({ error: "Waiting for next card."})
    }

    const currentCard = card[card.length - 1]
    const previousCard = card[card.length - 2]
    let activeCard = card

    const lobbyScores = scores.get(id)

    if (!lobbyScores) {
        updateCard({ id, card})
        if (currentCard.number !== previousCard.number) {
            const updatedScores = calculateScores(activeCard, lobbyGuesses, [])
            
            if (new Date().getTime() - new Date(previousCard.time).getTime() > 30000) {
                scores.set(id, updatedScores)
                guesses.set(id, [])
            }

            return res.json(updatedScores)
        }

        return res.json(lobbyScores)
    }

    if (currentCard.number !== previousCard.number && (new Date().getTime() - new Date(currentCard.time).getTime() > 30000)) {
        updateCard({ id, card})
        const newCard = cards.get(id) as Card[]
        const updatedScores = calculateScores(newCard, lobbyGuesses, lobbyScores)
        scores.set(id, updatedScores)
        guesses.set(id, [])
        return res.json(updatedScores)
    }

    return res.json(lobbyScores)
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

// Posts a guess for the next card in the specificed lobby
app.post('/card/:id/:name/:guess', (req, res) => {
    const { id, name, guess } = req.params

    if (!id || !name || !guess) {
        return res.status(400).json({ error: "id or guess parameter missing in the URL."})
    }
    
    const lobbyGuesses = guesses.get(id)
    
    if (!lobbyGuesses) {
        const value = guess === "1" || guess === "0"
        
        if (!value) {
            return res.status(400).json({ error: "You must guess either 0 (down) or 1 (up)"})
        }
        
        guesses.set(id, [{ name, value: guess === "1" ? true : false }])
        return res.status(200).json({ "result": `Successfully guessed ${guess === '1' ? 'up' : 'down'}.`})
    }

    const existingGuesses = Object.values(lobbyGuesses)
    
    for (const existingGuess of existingGuesses) {
        if (existingGuess.name === name) {
            return res.status(409).json({ "result": `You have already guessed ${existingGuess.value === true ? 'up' : 'down'}.`})
        }
    }

    lobbyGuesses.push({ name, value: guess === "1" ? true : false })
    return res.status(200).json({ "result": `Successfully guessed ${guess === '1' ? 'up' : 'down'}`})
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

// Goes to the next question
app.put('/game/:id', (req, res) => {
    const { id } = req.params

    if (!lobbies.has(id)) {
        return res.status(404).json({
            error: `Failed to go to the next question. Lobby ${id} does not exist`
        })
    }

    const lobby = lobbies.get(id) as Lobby
    const { question, asked, randomID } = getQuestion(lobby, id)

    if (question) {
        const title_no = replacePlaceholders(question.title_no, lobby.players)
        const title_en = replacePlaceholders(question.title_en, lobby.players)

        const current = {
            title_no,
            title_en,
            categories: question.categories
        }

        askedQuestions.set(id, [...asked, randomID])
        const updatedLobby = {...lobby, current}
        lobbies.set(id.toUpperCase(), updatedLobby)
    
        res.json({
            players: lobby.players,
            status: lobby?.status,
            current,
        })
    } else {
        askedQuestions.delete(id)
        const { question } = getQuestion(lobby, id)

        res.status(201).json({
            players: lobby.players,
            status: lobby?.status,
            current: question,
        })
    }
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

// Resets game
app.delete('/game/:id', (req, res) => {
    const { id } = req.params

    if (!lobbies.has(id)) {
        return res.status(404).json({
            error: `Failed to reset questions. Lobby ${id} does not exist.`
        })
    }

    askedQuestions.delete(id)

    const lobby = lobbies.get(id) as Lobby
    const { question, asked, randomID } = getQuestion(lobby, id)

    if (question) {
        const title_no = replacePlaceholders(question.title_no, lobby.players)
        const title_en = replacePlaceholders(question.title_en, lobby.players)

        const current = {
            title_no,
            title_en,
            categories: question.categories
        }

        askedQuestions.set(id, [...asked, randomID])
        const updatedLobby = {...lobby, current}
        lobbies.set(id.toUpperCase(), updatedLobby)
    
        return res.status(201).json({
            players: lobby.players,
            status: lobby?.status,
            current,
        })
    }

    res.status(500).json({ message: `Failed to get question after reset. Unknown result.` })
})

// Deletes game
app.delete('/lobby', (req, res) => {
    const id = checkBody(req, res)
    if (!id) return

    if (!lobbies.has(id)) {
        return res.status(404).json({
            error: `Failed to delete, lobby ${id} does not exist`
        })
    }

    lobbies.delete(id)
    res.status(201).json({ message: `Game ${id} has been deleted.` })
})

// Starts the API
app.listen(port, () => {
    console.log(`API is running on port ${port}`)
})

// Fetches the next question
function getQuestion(lobby: Lobby, id: string) {
    const custom = lobby?.questions || []
    const mergedQuestions = [...custom, ...questions]

    let randomID: number
    let question
    const asked = askedQuestions.get(id) || []

    do {
        randomID = Math.floor(Math.random() * 100) + 1
        question = mergedQuestions[randomID]
    } while (asked.includes(randomID) && asked.length < 100)

    return { question, asked, randomID }
}


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

// Replacec {player} with the actual player name
function replacePlaceholders(question: string, players: string[]) {
    return question.replace(/{player}/g, () => {
        const randomIndex = Math.floor(Math.random() * players.length)
        return players[randomIndex]
    })
}

// Calculates new scores based on given guesses
function calculateScores(card: Card[], guesses: Guess[], scores: Score[]) {
    const length = card.length
    const previousCardNumber = length > 1 ? card[length - 2].number : undefined
    const currentCard = card[length - 1].number

    if (!previousCardNumber) {
        for (const guess of guesses) {
            scores = defineUserScore(scores, guess.name)
        }

        return scores
    }

    const higher = previousCardNumber < currentCard
    
    for (const guess of guesses) {
        if (higher && guess.value) {
            scores = updateUser(scores, guess.name)
        } else if (!higher && !guess.value) {
            scores = updateUser(scores, guess.name)
        } else {
            defineUserScore(scores, guess.name)
        }
    }

    return scores
}

// Updates a users score
function updateUser(scores: Score[], name: string) {
    for (let i = 0; i < scores.length; i++) {
        if (scores[i].name === name) {
            scores[i] = { name, score: scores[i].score + 10 }
            return scores
        }
    }

    scores.push({ name, score: 10 })
    return scores
}

// Defines a users score
function defineUserScore(scores: Score[], name: string) {
    for (let i = 0; i < scores.length; i++) {
        if (scores[i].name === name) {
            return scores
        }
    }

    scores.push({ name, score: 0 })
    return scores
}

// Updates the card
function updateCard({id, card}: UpdateCardProps) {
    const currentCard = card[card.length - 1]

    if (new Date().getTime() - new Date(currentCard.time).getTime() > 30000) {
        let number = currentCard.number
        let newNumber = Math.floor(Math.random() * 12) + 2
        
        while (number === newNumber) {
            newNumber = Math.floor(Math.random() * 12) + 2
        }
        
        cards.set(id, [...card, { number: newNumber, time: new Date().getTime() }])
    }
}
