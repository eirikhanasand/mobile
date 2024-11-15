import { GuessButton } from "@/app/guess"
import { Text, View } from "react-native"
import { useSelector } from "react-redux"

type GuessButtonsProps = {
    roundStarted: boolean
    sendGuess: (value: 'higher' | 'lower') => Promise<void>
    card: OneToFourteen | undefined
    guess: OneToFourteen | undefined
}

export default function GuessButtons({roundStarted, sendGuess, card = 1, guess = 1}: GuessButtonsProps) {
    const { gameID } = useSelector((state: ReduxState) => state.game)
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const text = guess > card ? lang ? 'Høyere' : 'Higher' : lang ? 'Lavere' : 'Lower'

    if (guess === card) {
        return (
            <View style={{
                backgroundColor: theme.contrast,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
            }}>
                <Text style={{
                    fontWeight: 'bold', 
                    fontSize: 16,
                    color: theme.textColor
                }}>
                    {text}?
                </Text>
            </View>
        )
    }

    return (
        <>
            {gameID && roundStarted && <>
                <GuessButton
                    handler={() => gameID && sendGuess('higher')} 
                    text="Higher"
                />
                <GuessButton 
                    handler={() => gameID && sendGuess('lower')} 
                    text="Lower" 
                />
            </>}
        </>
    )
}
