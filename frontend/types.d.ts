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
