type Question = {
    title_no: string
    title_en: string
}

type Game = {
    name: string
    endpoint: string
    description_no: string
    description_en: string
}

type Lobby = {
    players: string[]
    // inlobby = Currently in lobby, waiting for host to start
    // ingame = round in progress
    // waiting = round was just completed, waiting for host to continue
    status: "inlobby" | "ingame" | "waiting"
    current?: number
    questions?: Question[]
}

type Player = {
    id: string
    name: string
}