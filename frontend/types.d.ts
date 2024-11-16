declare module '*.svg' {
    const content: string
    export default content
}

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
        players: string[]
    }
    music: {
        playing: boolean
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
    textBackground: string
    imageOverlay: string
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

type OneToFourteen = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14

type CardType = 'hearts' | 'spades' | 'clubs' | 'diamonds'

type Score = {
    name: string
    score: number
}

type Card = {
    number: OneToFourteen
    time: number
    type: CardType
}

type Guess = {
    value: boolean | undefined
    card: OneToFourteen | undefined
    time: number | undefined
}