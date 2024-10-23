import { API } from "@constants"

async function createLobby() {
    try {
        const response = await fetch(`${API}/lobby`, {
            method: "POST"
        })
    
        if (!response.ok) {
            throw new Error(`Failed to create lobby: ${response}`)
        }

        return response.json()
    } catch (error) {
        console.error(error)
    }
}

async function getLobby(id: string) {
    try {
        const response = await fetch(`${API}/lobby`, {
            body: JSON.stringify({ id })
        })

        if (!response.ok) {
            throw new Error(`Failed to get lobby with ID ${id}`)
        }

        return response.json()
    } catch (error) {
        console.error(error)
    }
}

async function joinLobby(id: string, name: string) {
    try {
        const response = await fetch(`${API}/lobby`, {
            method: "PUT",
            body: JSON.stringify({ id, name })
        })

        if (!response.ok) {
            throw new Error(`Failed to join lobby ${id} as ${name}.`)
        }

        return response.json()
    } catch (error) {
        console.error(error)
    }
}

async function deleteLobby(id: string) {
    try {
        const response = await fetch(`${API}/lobby`, {
            method: "DELETE",
            body: JSON.stringify({ id })
        })

        if (!response.ok) {
            throw new Error(`Failed to delete lobby ${id}.`)
        }

        return response.json()
    } catch (error) {
        console.error(error)
    }
}

async function kick(id: string, name: string) {
    try {
        const response = await fetch(`${API}/kick`, {
            method: "PUT",
            body: JSON.stringify({ id, name })
        })

        if (!response.ok) {
            throw new Error(`Failed to kick ${name} from ${id}.`)
        }

        return response.json()
    } catch (error) {
        console.error(error)
    }
}

async function nextQuestion(id: string) {
    try {
        const response = await fetch(`${API}/game`, {
            method: "PUT",
            body: JSON.stringify({ id })
        })

        if (!response.ok) {
            throw new Error(`Failed to go to next question in ${id}.`)
        }

        return response.json()
    } catch (error) {
        console.error(error)
    }
}
