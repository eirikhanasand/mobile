import { Dispatch, SetStateAction } from "react"
import { useSelector } from "react-redux"
import { nextQuestion as nextQuestionAPI, resetQuestions } from "@utils/lobby"
import SmallButton from "../smallButtons"
import { Text, View } from "react-native"
import PostQuestion from "./postQuestion"
import { setStatus } from "@utils/card"

type MultiplayerProps = {
    roundStarted: boolean
    finished: boolean
    currentQuestion: Question | null
    setCurrentQuestion: Dispatch<SetStateAction<Question | null>>
    setRoundStarted: Dispatch<SetStateAction<boolean>>
    setFinished: Dispatch<SetStateAction<boolean>>
}

export default function Multiplayer({
    roundStarted, 
    finished, 
    currentQuestion, 
    setCurrentQuestion, 
    setRoundStarted, 
    setFinished
}: MultiplayerProps) {
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { gameID, filters } = useSelector((state: ReduxState) => state.game)

    // Select the next random question that hasn't been asked yet
    async function nextQuestion() {
        if (gameID) {
            const next = await nextQuestionAPI(gameID, filters)
            
            if (next) {
                setCurrentQuestion(next.current)
            }
        }
    }

    // Restart the questions
    async function restartQuestions() {
        setRoundStarted(false)
        setFinished(false)
        setStatus(gameID, 'inlobby')

        if (gameID) {
            resetQuestions(gameID)
        }
    }

    if (!roundStarted || finished || !currentQuestion) {
        return <></>
    }

    return (
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

            <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-evenly', 
                marginVertical: 16 
            }}>
                <SmallButton 
                    handler={nextQuestion} 
                    text={lang ? "Neste spørsmål" : "Next question"} 
                />
                {(roundStarted || finished) && (
                    <SmallButton 
                        handler={restartQuestions} 
                        text={lang ? "Start på nytt" : "Restart Questions"} 
                    />
                )}
            </View>
            {roundStarted && <PostQuestion />}
        </>
    )
}
