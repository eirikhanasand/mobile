import LeaderBoard from "@components/leaderboard"
import Leave from "@components/leave"
import PlayerList from "@components/playerList"
import getCard, { postGuess } from "@utils/card"
import Cards from "@components/cards"
import { setGame } from "@redux/game"
import { getLobby, kick } from "@utils/lobby"
import { useNavigation } from "expo-router"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Dimensions, SafeAreaView, Text, TouchableOpacity, View } from "react-native"
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types"
import { useDispatch, useSelector } from "react-redux"
import PostQuestion from "@components/questions/postQuestion"
import GuessButtons from "@components/guess/guessButtons"

type OneHundredQuestionsProps = {
    text: string
    gameID: string
}

type CardViewProps = {
    status: string
    setStatus: Dispatch<SetStateAction<string>>
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
                height: text && status !== 'cards' ? '90%' : undefined, 
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
                {status === 'ingame' && <OneHundredQuestions text={text} gameID={gameID} />}
                {status === 'ingame' && <PostQuestion />}
                {status !== 'cards' && status !== 'ingame' && <Status text={status} />}
                <CardView status={status} setStatus={setStatus} />
            </View>
        </SafeAreaView>
    )
}

function CardView({status, setStatus}: CardViewProps) {
    const { gameID } = useSelector((state: ReduxState) => state.game)
    const { name } = useSelector((state: ReduxState) => state.name)
    const [card, setCard] = useState<Card>()
    const [guess, setGuess] = useState<Guess>()
    const roundStarted = status === 'cards'

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

    useEffect(() => {
        async function updateCard() {
            const newCard = await getCard(gameID as string)

            if (newCard) {
                setCard(newCard)
            }
        }

        async function fetchLobby() {
            const lobby = await getLobby(gameID)

            if (lobby) {
                setStatus(lobby.status)
            }
        }

        setInterval(async() => {
            if (gameID) {
                // Updates card
                await updateCard()

                // Fetches lobby
                await fetchLobby()
            }
        }, 2000)
    }, [])

    return (
        <View style={{marginTop: 40}}>
            {card && (roundStarted || !gameID) && <Cards
                card={card} 
                randomType={card.type} 
            />}
            {roundStarted && <GuessButtons
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
        </View>
    )
}

function Status({text}: {text: string}) {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const textToDisplay = text === 'pending' || text === 'inlobby'
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
