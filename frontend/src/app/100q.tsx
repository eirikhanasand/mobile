import PlayerList from '@components/playerList'
import FilterButtons from '@components/filterButtons'
import Leave from '@components/leave'
import SmallButton from '@components/smallButtons'
import { createLobby, joinLobby, kick, resetQuestions } from '@utils/lobby'
import { useState } from 'react'
import { Dimensions, Platform, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { nextQuestion as nextQuestionAPI } from "@utils/lobby"
import { useNavigation } from 'expo-router'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'
import { setGame } from '@redux/game'
import { setStatus } from '@utils/card'
import PostQuestion from '@components/postQuestion'

export default function Questions() {
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { name } = useSelector((state: ReduxState) => state.name)
    const { gameID } = useSelector((state: ReduxState) => state.game)
    const { filters } = useSelector((state: ReduxState) => state.game)
    const height = Dimensions.get('window').height
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
    const [roundStarted, setRoundStarted] = useState<boolean>(false)
    const [askedQuestions, setAskedQuestions] = useState<number[]>([])
    const [finished, setFinished] = useState<boolean>(false)
    const navigation = useNavigation<NativeStackNavigationProp<any>>()
    const dispatch = useDispatch()
    const gameModeText = lang ? 'Gjett' : 'Guess'

    // Start the game when the component mounts
    async function startGame() {
        const id = await createLobby()

        if (id) {
            dispatch(setGame(id))
            joinLobby(id, name)
        }
    }

    // Start a new round with a random question
    async function startRound() {
        setRoundStarted(true)
        setStatus(gameID, 'ingame')
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
            const next = await nextQuestionAPI(gameID, filters)
            
            if (next) {
                setCurrentQuestion(next.current)
            }
        }
    }

    // Restart the questions
    async function restartQuestions() {
        setAskedQuestions([])
        setRoundStarted(false)
        setFinished(false)
        setStatus(gameID, 'inlobby')

        if (gameID) {
            resetQuestions(gameID)
        }
    }

    function leave() {
        kick(gameID as string, name)
        dispatch(setGame(null))
        setRoundStarted(false)
        navigation.navigate("index")
    }

    function switchGameMode() {
        setStatus(gameID, 'inlobby')
        setRoundStarted(false)
        navigation.navigate('guess')
    }

    // Render the component
    return (
        <SafeAreaView style={{ backgroundColor: theme.background, height }}>
            <View style={{ paddingHorizontal: 8 }}>
                    <View style={{ 
                        flexDirection: 'row', 
                        justifyContent: 'space-between',
                        paddingTop: Platform.OS !== "ios" ? 40 : undefined,
                    }}>
                        <Text style={{ 
                            color: theme.titleTextColor, 
                            fontSize: 28, 
                            fontWeight: 'bold', 
                            width: '100%'
                        }}>
                            {lang ? "100 Spørsmål" : "100 questions"}
                            {gameID ? ` - ${gameID}` : ''}
                        </Text>
                        {gameID && <TouchableOpacity 
                            style={{ position: 'absolute', right: 0, paddingTop: Platform.OS !== "ios" ? 40 : undefined }} 
                            onPress={leave}
                        >
                            <Leave />
                        </TouchableOpacity>}
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <FilterButtons gameID={gameID} />
                        <TouchableOpacity
                            style={{
                                padding: 8,
                                margin: 4,
                                borderWidth: 1,
                                borderRadius: 4,
                            }}
                            onPress={switchGameMode}
                        >
                            <Text style={{ color: theme.textColor }}>{gameModeText}</Text>
                        </TouchableOpacity>
                    </View>
                {!roundStarted && (
                    <>
                        {!gameID && <SmallButton handler={startGame} text={lang ? "Lag en lobby" : "Create a lobby"} />}
                        <PlayerList gameID={gameID} />
                        {gameID && <SmallButton handler={startRound} text={lang ? "Start" : "Start"} />}
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
        
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 16 }}>
                            <SmallButton handler={nextQuestion} text={lang ? "Neste spørsmål" : "Next question"} />
                            {(roundStarted || finished) && (
                                <SmallButton handler={restartQuestions} text={lang ? "Start på nytt" : "Restart Questions"} />
                            )}
                        </View>
                        {roundStarted && <PostQuestion />}
                    </>
                )}
                {finished && (
                    <Text style={{ color: theme.textColor, fontSize: 20, marginTop: 20 }}>
                        {lang ? "Ferdig" : "Finished"}
                    </Text>
                )}
            </View>
        </SafeAreaView>
    )
}
