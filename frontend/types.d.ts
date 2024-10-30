type ReduxState = {
    theme: {
        value: number
        isDark: boolean
        theme: Theme
    }
    lang: {
        lang: boolean
    }
    name: {
        name: string
    }
    game: {
        gameID: string
        joined: boolean
    }
}

type Theme = {
    background: string
    darker: string
    contrast: string
    transparent: string
    transparentAndroid: string
    orange: string
    textColor: string
    titleTextColor: string
    oppositeTextColor: string
    switchOnState: string
    switchOffState: string
    trackColor: string
    trackBackgroundColor: string
    dark: string
    red: string
    blue: string
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

type Question = {
    title_no: string
    title_en: string
}
