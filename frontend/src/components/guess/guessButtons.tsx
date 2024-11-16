import { Text, TouchableOpacity, View } from "react-native"
import { useSelector } from "react-redux"

type GuessButtonsProps = {
    roundStarted: boolean
    sendGuess: (value: 'higher' | 'lower') => Promise<void>
    card: Card | undefined
    guess: Guess
}

type ButtonProps = {
    handler: () => void
    text: string
}

export default function GuessButtons({sendGuess, card = 
    { type: 'hearts', number: 1, time: 0}, guess}: GuessButtonsProps) {
    const { gameID } = useSelector((state: ReduxState) => state.game)
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const guessAge = (new Date().getTime() - new Date(guess.time || 0).getTime()) / 1000
    const cardAge = Math.ceil((new Date().getTime() - new Date(card.time || 0).getTime()) / 1000)
    const correct = ((guess.card || 0) > card.number && guess.value === false) 
        || ((guess.card || 0) < card.number && guess.value === true)
    const text = getText()

    function getText() {
        if (guess.value === true) {
            if (lang) return 'Høyere'
            else return 'Higher'
        } else {
            if (lang) return 'Lavere'
            else return 'Lower'
        }
    }

    if (guess.card === card.number) {
        return (
            <View style={{
                backgroundColor: theme.blue,
                alignSelf: 'center',
                paddingBottom: 10,
                paddingHorizontal: 20,
                borderRadius: 200,
                aspectRatio: 1/1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Countdown cardAge={cardAge} />
                <Text style={{
                    fontWeight: 'bold', 
                    fontSize: 16,
                    color: theme.textColor,
                    top: -10
                }}>
                    {text}
                </Text>
            </View>
        )
    }

    return (
        <View>
            {guessAge < 35 && <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: correct ? 'green' : 'red',
                marginHorizontal: 20,
                borderRadius: 8,
                height: 40,
                marginBottom: 30
            }}>
                <Text style={{
                    color: theme.textColor,
                    fontWeight: 'bold',
                }}>
                    {correct ? lang ? 'Riktig' : 'Correct' : lang ? 'Feil' : 'Wrong'}
                </Text>
            </View>}
            <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-evenly'}}>
                {gameID && <>
                    <GuessButton
                        handler={() => gameID && sendGuess('higher')} 
                        text={lang ? 'Høyere' : 'Higher'}
                    />
                    <Countdown cardAge={cardAge} />
                    <GuessButton 
                        handler={() => gameID && sendGuess('lower')} 
                        text={lang ? 'Lavere' : 'Lower'}
                    />
                </>}
            </View>
        </View>
    )
}

export function GuessButton({handler, text}: ButtonProps) {
    const { theme } = useSelector((state: ReduxState) => state.theme)

    return (
        <TouchableOpacity
            style={{
                backgroundColor: theme.contrast,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
                alignSelf: 'center'
            }}
            onPress={handler}
        >
            <Text style={{ 
                color: theme.textColor,
                fontSize: 16, 
                fontWeight: 'bold'
            }}>
                {text}
            </Text>
        </TouchableOpacity>
    )
}

function Countdown({cardAge}: {cardAge: number}) {
    const { theme } = useSelector((state: ReduxState) => state.theme)

    return (
        <View style={{
            backgroundColor: theme.blue,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 100,
            height: 70,
            width: 70,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Text style={{
                color: theme.textColor,
                fontSize: 16, 
                fontWeight: 'bold'
            }}>{30 - cardAge}</Text>
        </View>
    )
}
