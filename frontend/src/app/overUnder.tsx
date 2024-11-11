import React, { useEffect, useState } from 'react'
import Card, { getRandomCard } from '@components/card'
import { useSelector } from "react-redux"
import { SvgXml } from 'react-native-svg'
import Backside from '@assets/images/backside.svg'
import getCard, { getScores, postGuess } from '@utils/card'
import SmallButton from '@components/smallButtons'
import { createLobby, joinLobby } from '@utils/lobby'
import { 
    SafeAreaView, 
    Text, 
    View, 
    TouchableOpacity, 
    Dimensions 
} from 'react-native'
import PlayerList from '@components/playerList'

type ButtonProps = {
    handler: () => void
    text: string
}

type Score = {
    name: string
    score: number
}

type CardsProps = {
    card: OneToFourteen
    randomType: CardType
}

export default function OverUnder() {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { name } = useSelector((state: ReduxState) => state.name)
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const [gameID, setGameID] = useState<string | null>(null)
    const [roundStarted, setRoundStarted] = useState<boolean>(false)
    const height = Dimensions.get('window').height
    const [card, setCard] = useState<OneToFourteen>()
    const [randomType, setRandomType] = useState<CardType>('hearts')
    const [scores, setScores] = useState<Score[]>([])
    
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
            setGameID(id)
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
    
    useEffect(() => {
        async function updateCard() {
            const newCard = await getCard(gameID as string)

            if (newCard) {
                setCard(newCard)
            }
        }

        async function updateScores() {
            const scores = await getScores(gameID as string)

            if (scores) {
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

    console.log("Card", card, randomType)

    return (
        <SafeAreaView style={{backgroundColor: theme.background, height }}>
            <View>
                <Text style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: theme.textColor
                }}>Guess{gameID && ` - ${gameID}`}</Text>
                <Text style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: theme.textColor
                }}></Text>
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
            {card && roundStarted && <Cards card={card} randomType={randomType} />}
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                {!gameID && <Button 
                    handler={() => gameID ? guess('higher') : next()} 
                    text="Next" 
                />}
                {gameID && roundStarted && <>
                    <Button 
                        handler={() => gameID && guess('higher')} 
                        text="Higher" 
                    />
                    <Button 
                        handler={() => gameID && guess('lower')} 
                        text="Lower" 
                    />
                </>}
            </View>
        </SafeAreaView>
    )
}

function Button({handler, text}: ButtonProps) {
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

function Cards({card, randomType}: CardsProps) {
    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 20,
        }}>
            <View style={{
                minWidth: 150,
                height: 250,
                maxHeight: 250,
                borderRadius: 10,
            }}>
                <SvgXml 
                    xml={Backside} 
                    style={{maxWidth: 150, maxHeight: 250}} 
                />
            </View>

            {card && <View style={{
                width: 150,
                height: 250,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Card 
                    number={card} 
                    type={randomType}
                    style={{ 
                        height: 250, minHeight: 250, maxHeight: 250,
                        width: 150, minWidth: 150, maxWidth: 150 
                    }} 
                />
            </View>}
        </View>
    )
}