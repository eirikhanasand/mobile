import React, { useEffect, useState } from 'react'
import getCard, { postGuess, setStatus } from '@utils/card'
import SmallButton from '@components/smallButtons'
import PlayerList from '@components/playerList'
import LeaderBoard from '@components/leaderboard'
import Leave from '@components/leave'
import Cards from '@components/cards'
import { getRandomCard } from '@components/card'
import { useDispatch, useSelector } from "react-redux"
import { createLobby, joinLobby, kick } from '@utils/lobby'
import { setGame } from '@redux/game'
import { useNavigation } from 'expo-router'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'
import { 
    SafeAreaView, 
    Text, 
    View, 
    TouchableOpacity, 
    Dimensions, 
    Platform
} from 'react-native'

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

export default function Guess() {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { name } = useSelector((state: ReduxState) => state.name)
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const { gameID } = useSelector((state: ReduxState) => state.game)
    const [roundStarted, setRoundStarted] = useState<boolean>(false)
    const height = Dimensions.get('window').height
    const [card, setCard] = useState<Card>()
    const [randomType, setRandomType] = useState<CardType>('hearts')
    const navigation = useNavigation<NativeStackNavigationProp<any>>()
    const dispatch = useDispatch()
    const [guess, setGuess] = useState<Guess>()
    const gameModeText = lang ? '100 Spørsmål' : '100 Questions'
    
    async function sendGuess(value: 'higher' | 'lower') {
        const response = await postGuess({ 
            gameID: gameID as string, 
            name, 
            guess: value === 'higher' ? '1' : '0' 
        })
        
        if (response) {
            if (response.result.includes('Successfully guessed') && card) {
                setGuess({
                    value: value === 'higher' ? true : false, 
                    card: card.number,
                    time: card.time
                })
            }
        }
    }

    async function startGame() {
        const id = await createLobby()
        
        if (id) {
            dispatch(setGame(id))
            joinLobby(id, name)
        }
    }

    function next() {
        const random = getRandomCard()

        if (random) {
            setRandomType(random.type)
            setCard({ ...random, time: 0 })
        }
    }

    function switchGameMode() {
        setStatus(gameID, 'ingame')
        navigation.navigate('100q') 
    }

    function leave() {
        kick(gameID as string, name)
        dispatch(setGame(null))
        setRoundStarted(false)
        navigation.navigate("index")
    }
    
    useEffect(() => {
        async function updateCard() {
            const newCard = await getCard(gameID as string)

            if (newCard) {
                setCard(newCard)
            }
        }

        setInterval(async() => {
            if (gameID) {
                // Updates card
                await updateCard()
            }
        }, 2000)
    }, [gameID])

    useEffect(() => {
        if (!gameID) {
            const random = getRandomCard()

            if (random) {
                setRandomType(random.type)
                setCard({ ...random, time: 1 })
            }
        }
    }, [gameID])

    async function start() {
        setStatus(gameID, 'cards')
        setRoundStarted(true)
    }

    return (
        <SafeAreaView style={{backgroundColor: theme.background, height }}>
            <View>
                <View style={{flexDirection: 'row', justifyContent: 'space-around', paddingTop: Platform.OS !== "ios" ? 40 : undefined}}>
                    <Text style={{
                        fontSize: gameID ? 25 : 30,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: theme.titleTextColor
                    }}>
                        {lang ? "Gjett" : "Guess"} {gameID && ` - ${gameID}`}
                    </Text>
                    {gameID && <TouchableOpacity
                        style={{
                            padding: 8,
                            marginVertical: 4,
                            top: -5,
                            right: 25,
                            borderWidth: 1,
                            borderRadius: 4,
                        }}
                        onPress={switchGameMode}
                    >
                        <Text style={{ color: theme.textColor }}>{gameModeText}</Text>
                    </TouchableOpacity>}
                    {gameID && <TouchableOpacity 
                            style={{ position: 'absolute', right: 8, paddingTop: Platform.OS !== "ios" ? 40 : undefined}} 
                            onPress={leave}
                        >
                            <Leave />
                        </TouchableOpacity>}
                </View>
                {!roundStarted && (
                    <>
                        {!gameID && <SmallButton 
                            handler={startGame} 
                            text={lang ? "Flerspiller" : "Multiplayer"} 
                        />}
                        <View style={{paddingHorizontal: 8}}>
                            <PlayerList gameID={gameID} />
                        </View>
                        {gameID && <SmallButton 
                            handler={start} 
                            text="Start"
                        />}
                    </>
                )}
            </View>
            {card && (roundStarted || !gameID) && <Cards
                card={card} 
                randomType={card.type} 
            />}
            {!gameID && <GuessButton 
                handler={() => gameID ? sendGuess('higher') : next()} 
                text={lang ? "Neste" : "Next"} 
            />}
            {gameID && roundStarted && <GuessButtons 
                roundStarted={roundStarted} 
                sendGuess={sendGuess} 
                card={card}
                guess={{
                    value: guess?.value, 
                    card: guess?.card,
                    time: guess?.time
                }}
            />}
            {gameID && roundStarted && <LeaderBoard gameID={gameID} />}
        </SafeAreaView>
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

export function GuessButtons({sendGuess, card = 
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