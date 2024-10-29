import PlayerList from "@components/playerList"
import { getLobby } from "@utils/lobby"
import { useEffect, useState } from "react"
import { Dimensions, SafeAreaView, Text, View } from "react-native"
import { useSelector } from "react-redux"

export default function Joined() {
    const { gameID } = useSelector((state: ReduxState) => state.game)
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const [current, setCurrent] = useState<number | null>(null)
    const [question, setQuestion] = useState({} as Question)
    const text = lang ? question?.title_no : question?.title_en
    const height = Dimensions.get('window').height

    // Fetches questions from API every second
    useEffect(() => {
        async function fetch() {
            const lobby = await getLobby(gameID)

            if ('current' in lobby) {
                const current = lobby.current

                if (typeof current === 'number') {
                    setCurrent(current)
                } else {
                    setCurrent(current.id)
                    setQuestion(current.question)
                }
            }
        }
    
        setInterval(() => {
            fetch()
        }, 1000);
    }, [])

    return (
        <SafeAreaView style={{ backgroundColor: theme.background, height }}>
            <View style={{paddingHorizontal: 8}}>
                <Text style={{ color: theme.textColor, fontSize: 30, fontWeight: 'bold'}}>
                    Lobby - {gameID}
                </Text>
                <PlayerList gameID={gameID} />
                <Text>{text}</Text>
            </View>
        </SafeAreaView>
    )
}
