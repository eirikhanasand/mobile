import { API } from "@constants"

type PostGuessProps = {
    gameID: string
    name: string
    guess: '0' | '1'
}

// Fetches the current card for a specific game
export default async function getCard(gameID: string) {
    try {
        const response = await fetch(`${API}/card/${gameID}`)

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error(`Failed to fetch: ${error}`)
    }
}

// Fetches the current card scores for a specific lobby
export async function getScores(gameID: string) {
    try {
        const response = await fetch(`${API}/scores/${gameID}`)

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        return data
    } catch (error: any) {
        // Most likely just no guesses yet
        // console.error(`Failed to fetch: ${error}`)
        return null
    }
}

// Posts a guess for the next card for the specified lobby with the given name
export async function postGuess({ gameID, name, guess}: PostGuessProps) {
    console.log("posted", `${API}/card/${gameID}/${name}/${guess}`, new Date().getTime())
    try {
        const response = await fetch(`${API}/card/${gameID}/${name}/${guess}`, {
            method: 'POST'
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error(`Failed to fetch: ${error}`)
    }
}


// Fetches the current card for a specific game
export async function setStatus(gameID: string, status: string) {
    try {
        const response = await fetch(`${API}/status/${gameID}/${status}`)

        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error(`Failed to fetch: ${error}`)
    }
}