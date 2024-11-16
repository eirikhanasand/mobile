import { nextSinglePlayerQuestion } from "@utils/lobby"
import { Dispatch, SetStateAction } from "react"
import { Text, View } from "react-native"
import { useSelector } from "react-redux"
import SmallButton from "../smallButtons"

type SingleplayerProps = {
    currentQuestion: Question | null
    setCurrentQuestion: Dispatch<SetStateAction<Question | null>>
    roundStarted: boolean
}

export default function Singleplayer({currentQuestion, setCurrentQuestion, 
    roundStarted}: SingleplayerProps) {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const { name } = useSelector((state: ReduxState) => state.name)
    const { gameID, filters } = useSelector((state: ReduxState) => state.game)

    async function nextQuestionSinglePlayer() {
        const question = await nextSinglePlayerQuestion(name, filters)

        if (question) {
            setCurrentQuestion(question.current)
        }
    }

    if (roundStarted || gameID || !currentQuestion) {
        return <></>
    }

    return (
        <View>
            <View style={{
                borderWidth: 1,
                padding: 16,
                borderRadius: 8,
                marginVertical: 16,
                backgroundColor: theme.blue,
                marginTop: 50
            }}>
                <Text style={{ color: theme.textColor, fontSize: 20 }}>
                    {lang ? currentQuestion?.title_no : currentQuestion?.title_en}
                </Text>
            </View>
            <SmallButton
                handler={nextQuestionSinglePlayer} 
                text={lang ? "Neste spørsmål" : "Next question"} 
            />
        </View>
    )
}