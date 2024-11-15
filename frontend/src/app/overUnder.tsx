import React, { useEffect, useState } from 'react'
import getCard, { getScores, postGuess } from '@utils/card'
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

type ButtonProps = {
    handler: () => void
    text: string
}

export default function OverUnder() {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { name } = useSelector((state: ReduxState) => state.name)
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const { gameID } = useSelector((state: ReduxState) => state.game)
    const [roundStarted, setRoundStarted] = useState<boolean>(false)
    const height = Dimensions.get('window').height
    const [card, setCard] = useState<OneToFourteen>()
    const [randomType, setRandomType] = useState<CardType>('hearts')
    const [scores, setScores] = useState<Score[]>([])
    const navigation = useNavigation<NativeStackNavigationProp<any>>()
    const dispatch = useDispatch()
    const gameModeText = lang ? '100 Spørsmål' : '100 Questions'
    
    async function guess(value: 'higher' | 'lower') {
        const response = await postGuess({ 
            gameID: gameID as string, 
            name, 
            guess: value === 'higher' ? '1' : '0' 
        })
        
        if (response) {
            // successfully guessed whatever...
            // waiting for other players to guess...
            console.log(response)
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
            setCard(random.number)
        }
    }

    function switchGameMode() {
        navigation.navigate('100q')   
    }
    
    useEffect(() => {
        async function updateCard() {
            const newCard = await getCard(gameID as string)

            if (newCard) {
                setCard(newCard)
            }
        }

        async function updateScores() {
            const scores = await getScores(gameID as string)

            if (scores && !('error' in scores)) {
                setScores(scores)
            }
        }

        setInterval(async() => {
            if (gameID) {
                // Updates card
                await updateCard()
    
                // Updates scores
                await updateScores()
            }
        }, 2000)
    }, [])

    useEffect(() => {
        if (!gameID) {
            const random = getRandomCard()

            if (random) {
                setRandomType(random.type)
                setCard(random.number)
            }
        }
    }, [])

    function leave() {
        kick(gameID as string, name)
        dispatch(setGame(null))
        setRoundStarted(false)
        navigation.navigate("index")
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
                            handler={() => setRoundStarted(true)} 
                            text={lang ? "Start" : "Start"} 
                        />}
                    </>
                )}
            </View>
            {gameID && roundStarted && <LeaderBoard gameID={gameID} />}
            {card && (roundStarted || !gameID) && <Cards
                card={card} 
                randomType={randomType} 
            />}
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                {!gameID && <GuessButton 
                    handler={() => gameID ? guess('higher') : next()} 
                    text={lang ? "Neste" : "Next"} 
                />}
                {gameID && roundStarted && <>
                    <GuessButton 
                        handler={() => gameID && guess('higher')} 
                        text="Higher" 
                    />
                    <GuessButton 
                        handler={() => gameID && guess('lower')} 
                        text="Lower" 
                    />
                </>}
            </View>
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
