import { API } from "@constants"

export async function createLobby() {
    try {
        const response = await fetch(`${API}/lobby`, { method: "POST" })
    
        if (!response.ok) {
            throw new Error(`Failed to create lobby: ${response}`)
        }

        return response.json()
    } catch (error) {
        console.error(error)
    }
}

export async function getLobby(id: string) {
    try {
        const response = await fetch(`${API}/lobby/${id}`)

        if (!response.ok) {
            throw new Error(`Failed to get lobby with ID ${id}`)
        }

        return response.json()
    } catch (error) {
        console.error(error)
    }
}

export async function joinLobby(id: string, name: string) {
    try {
        const response = await fetch(`${API}/lobby`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, name })
        })

        if (!response.ok) {
            throw new Error(`Failed to join lobby ${id} as ${name}. Reason: ${response}`)
        }

        return response.json()
    } catch (error) {
        console.error(error)
    }
}

export async function deleteLobby(id: string) {
    try {
        const response = await fetch(`${API}/lobby`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
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

export async function kick(id: string, name: string) {
    try {
        const response = await fetch(`${API}/kick`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
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

export async function nextQuestion(id: string) {
    try {
        const response = await fetch(`${API}/game`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
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
