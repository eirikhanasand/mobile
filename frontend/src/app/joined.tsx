import LeaderBoard from "@components/leaderboard"
import Leave from "@components/leave"
import PlayerList from "@components/playerList"
import getCard, { getScores, postGuess } from "@utils/card"
import Cards from "@components/cards"
import { setGame } from "@redux/game"
import { getLobby, kick } from "@utils/lobby"
import { useNavigation } from "expo-router"
import { useEffect, useState } from "react"
import { Dimensions, SafeAreaView, Text, TouchableOpacity, View } from "react-native"
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types"
import { useDispatch, useSelector } from "react-redux"
import { GuessButton } from "./overUnder"

type OneHundredQuestionsProps = {
    text: string
    gameID: string
}

export default function Joined() {
    const { gameID } = useSelector((state: ReduxState) => state.game)
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { name } = useSelector((state: ReduxState) => state.name)
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const [question, setQuestion] = useState({} as Question)
    const dispatch = useDispatch()
    const text = lang ? question?.title_no : question?.title_en
    const height = Dimensions.get('window').height
    const navigation = useNavigation<NativeStackNavigationProp<any>>()
    const [status, setStatus] = useState('pending')

    // Fetches questions from API every second
    useEffect(() => {
        let intervalId

        async function fetch() {
            const lobby = await getLobby(gameID)
            console.log("lobby", lobby)
            if ('current' in lobby) {
                const next = lobby.current

                if (next && next != question) {
                    setQuestion(next)
                }
            }
        }
    
        intervalId = setInterval(() => {
            fetch()
        }, 1000);

        return () => {
            clearInterval(intervalId)
        }
    }, [gameID])

    function leave() {
        kick(gameID as string, name)
        dispatch(setGame(null))
        setQuestion({} as Question)
        navigation.navigate("index")
    }
    
    return (
        <SafeAreaView style={{ backgroundColor: theme.background, height }}>
            <View style={{ 
                paddingHorizontal: 8, 
                height: text ? '90%' : undefined, 
                justifyContent: 'center' 
            }}>
                <View style={{
                    flexDirection: 'row', 
                    justifyContent: 'space-between',
                    position: text ? 'absolute' : undefined,
                    top: text ? 0 : undefined,
                    width: '100%'
                }}>
                    <Text style={{ 
                        color: theme.titleTextColor, 
                        fontSize: 30, 
                        fontWeight: 'bold', 
                        left: 8
                    }}>
                        Lobby - {gameID}
                    </Text>
                    <TouchableOpacity onPress={leave}>
                        <Leave color={theme.titleTextColor} />
                    </TouchableOpacity>
                </View>
                <OneHundredQuestions text={text} gameID={gameID} />
                <Status text={status} />
                <CardView status={status} />
            </View>
        </SafeAreaView>
    )
}

function CardView({status}: {status: string}) {
    const { gameID } = useSelector((state: ReduxState) => state.game)
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const { name } = useSelector((state: ReduxState) => state.name)
    const [card, setCard] = useState<OneToFourteen>()
    const [scores, setScores] = useState<Score[]>()
    const [randomType, setRandomType] = useState<CardType>('hearts')
    const roundStarted = status === 'cards'

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

    return (
        <View style={{marginTop: 20}}>
            {gameID && roundStarted && <LeaderBoard gameID={gameID} />}
            {card && (roundStarted || !gameID) && <Cards
                card={card} 
                randomType={randomType} 
            />}
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                {gameID && roundStarted && <>
                    <GuessButton 
                        handler={() => gameID && guess('higher')} 
                        text={lang ? 'Høyere' : 'Higher'} 
                    />
                    <GuessButton 
                        handler={() => gameID && guess('lower')} 
                        text={lang ? 'Lavere' : 'Lower'}
                    />
                </>}
            </View>
        </View>
    )
}

function Status({text}: {text: string}) {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const textToDisplay = text === 'pending' 
        ? lang ? 'Venter på at verten skal starte...' : 'Waiting for host to start...'
        : lang ? 'Ukjent' : 'Unknown'

    return (
        <View style={{
            backgroundColor: theme.contrast, 
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 12
        }}>
            <Text style={{color: theme.textColor, fontSize: 18}}>
                {textToDisplay}
            </Text>
        </View>
    )
}

function OneHundredQuestions({text, gameID}: OneHundredQuestionsProps) {
    const { theme } = useSelector((state: ReduxState) => state.theme)

    return (
        <>
            {!text && <PlayerList gameID={gameID} />}
            {text && <View style={{
                backgroundColor: theme.blue,
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Text style={{ 
                    color: theme.textColor,
                    padding: 8,
                    fontSize: 20
                }}>
                    {text}
                </Text>
            </View>}
        </>
    )
}
