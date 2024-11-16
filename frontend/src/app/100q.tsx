import Multiplayer from '@components/questions/multiplayer'
import Singleplayer from '@components/questions/singleplayer'
import Header from '@components/questions/header'
import Finished from '@components/questions/finished'
import CreateLobby from '@components/questions/lobby'
import { nextQuestion as nextQuestionAPI } from "@utils/lobby"
import { nextSinglePlayerQuestion } from '@utils/lobby'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { setStatus } from '@utils/card'
import { Dimensions, SafeAreaView, View } from 'react-native'

export default function Questions() {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { name } = useSelector((state: ReduxState) => state.name)
    const { gameID } = useSelector((state: ReduxState) => state.game)
    const { filters } = useSelector((state: ReduxState) => state.game)
    const height = Dimensions.get('window').height
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
    const [roundStarted, setRoundStarted] = useState<boolean>(false)
    const [finished, setFinished] = useState<boolean>(false)

    // Start a new round with a random question
    async function startRound() {
        setRoundStarted(true)
        setStatus(gameID, 'ingame')
        const next = await nextQuestionAPI(gameID as string)

        if (next) {
            setCurrentQuestion(next.current)
        }
    }

    useEffect(() => {
        (async() => {
            const question = await nextSinglePlayerQuestion(name, filters)

            if (question) {
                setCurrentQuestion(question.current)
            }
        })()
    }, [])

    return (
        <SafeAreaView style={{ backgroundColor: theme.background, height }}>
            <View style={{ paddingHorizontal: 8 }}>
                <Header
                    roundStarted={roundStarted}
                    setRoundStarted={setRoundStarted}
                />
                <CreateLobby
                    roundStarted={roundStarted}
                    startRound={startRound}
                />
                <Singleplayer
                    currentQuestion={currentQuestion}
                    setCurrentQuestion={setCurrentQuestion}
                    roundStarted={roundStarted}
                />
                <Multiplayer
                    roundStarted={roundStarted}
                    finished={finished}
                    currentQuestion={currentQuestion}
                    setCurrentQuestion={setCurrentQuestion}
                    setRoundStarted={setRoundStarted}
                    setFinished={setFinished}
                />
                <Finished finished={finished} />
            </View>
        </SafeAreaView>
    )
}
