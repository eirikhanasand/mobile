import Button from '@components/button'
import PlayerList from '@components/playerList'
import { createLobby, getLobby, joinLobby, kick } from '@utils/lobby'
import { useState } from 'react'
import { Dimensions, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import FilterButtons from '@components/filterButtons'
import Rules from '@components/rules'
import { nextQuestion as nextQuestionAPI } from "@utils/lobby"
import Leave from '@components/leave'
import { setGame } from '@redux/game'
import { useNavigation } from 'expo-router'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'


export default function Questions() {
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { name } = useSelector((state: ReduxState) => state.name)
    const height = Dimensions.get('window').height
    const [gameID, setGameID] = useState<string | null>(null)
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
    const [roundStarted, setRoundStarted] = useState<boolean>(false)
    const [askedQuestions, setAskedQuestions] = useState<number[]>([])
    const [finished, setFinished] = useState<boolean>(false)
    const [players, setPlayers] = useState<string[]>([])
    const [showExplanation, setShowExplanation] = useState<boolean>(true)
    const navigation = useNavigation<NativeStackNavigationProp<any>>()

    // Start the game when the component mounts
    async function startGame() {
        const id = await createLobby()

        if (id) {
            setGameID(id)
            joinLobby(id, name)
            fetchPlayers(id)
            setShowExplanation(false)
        }
    }

    // Fetch the players in the lobby
    async function fetchPlayers(lobbyID: string) {
        const lobby = await getLobby(lobbyID)

        if (lobby && Array.isArray(lobby.players)) {
            setPlayers(lobby.players)
        } else {
            console.error('Invalid lobby structure or no players found')
        }
    }

    // Start a new round with a random question
    async function startRound() {
        setRoundStarted(true)
        const next = await nextQuestionAPI(gameID as string)

        if (next) {
            setCurrentQuestion(next.current)
        }
    }

    // Select the next random question that hasn't been asked yet
    async function nextQuestion() {
        if (askedQuestions.length >= 100) {
            setFinished(true)
            return
        }

        if (gameID) {
            const next = await nextQuestionAPI(gameID)
            
            if (next) {
                setCurrentQuestion(next.current)
            }
        }
    }

    // Restart the questions
    function restartQuestions() {
        setCurrentQuestion(null)
        setRoundStarted(false)
        setAskedQuestions([])
        setFinished(false)

        if (gameID) {
            fetchPlayers(gameID)
        }
    }

    function leave() {
        kick(gameID as string, name)
        setGameID(null)
        setRoundStarted(false)
        navigation.navigate("index")
    }

    // Render the component
    return (
        <SafeAreaView style={{ backgroundColor: theme.background, height }}>
            <View style={{ paddingHorizontal: 8 }}>
                    <View style={{ 
                        marginVertical: 8, 
                        flexDirection: 'row', 
                        justifyContent: 'space-between',
                        paddingRight: 8
                    }}>
                        <Text style={{ color: theme.titleTextColor, fontSize: 28, fontWeight: 'bold' }}>
                            {lang ? "100 Spørsmål" : "100 questions"}
                            {gameID ? ` - ${gameID}` : ''}
                        </Text>
                        {gameID && <TouchableOpacity onPress={leave}>
                            <Leave />
                        </TouchableOpacity>}
                    </View>
                    <FilterButtons />
                <Rules show={showExplanation} />
                {!roundStarted && (
                    <>
                        {!gameID && <Button handler={startGame} text={lang ? "Lag en lobby" : "Create a lobby"} />}
                        <PlayerList gameID={gameID} />
                        {gameID && <Button handler={startRound} text={lang ? "Start" : "Start"} />}
                    </>
                )}
                {roundStarted && !finished && currentQuestion && (
                    <>
                        <View style={{
                            borderWidth: 1,
                            padding: 16,
                            borderRadius: 8,
                            marginVertical: 16,
                            backgroundColor: theme.blue
                        }}>
                            <Text style={{ color: theme.textColor, fontSize: 20 }}>
                                {lang ? currentQuestion.title_no : currentQuestion.title_en}
                            </Text>
                        </View>
        
                        <Button handler={nextQuestion} text={lang ? "Neste spørsmål" : "Next question"} />
                    </>
                )}
                {finished && (
                    <Text style={{ color: theme.textColor, fontSize: 20, marginTop: 20 }}>
                        {lang ? "Ferdig" : "Finished"}
                    </Text>
                )}
                {(roundStarted || finished) && (
                    <View style={{ marginVertical: 8 }}>
                        <Button handler={restartQuestions} text={lang ? "Start på nytt" : "Restart Questions"} />
                    </View>
                )}
            </View>
        </SafeAreaView>
    )
}
