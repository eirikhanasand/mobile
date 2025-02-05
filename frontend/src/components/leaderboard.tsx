import { getScores } from "@utils/card"
import { useEffect, useState } from "react"
import { ScrollView, Text, View } from "react-native"
import { useSelector } from "react-redux"

type LeaderBoardProps = {
    gameID: string
}

type Score = {
    name: string
    score: number
}

export default function LeaderBoard({gameID}: LeaderBoardProps) {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const [scores, setScores] = useState<Score[]>([])

    async function updateScores() {
        const response = await getScores(gameID)

        if (response) {
            setScores(response)
        }
    }

    useEffect(() => {
        setInterval(async() => {
            await updateScores()
        }, 2000)
    }, [])

    if (!Array.isArray(scores)) {
        return null
    }

    if (!scores.length) {
        return null
    }

    return (
        <View style={{
            margin: 14, 
            backgroundColor: theme.contrast,
            borderRadius: 20,
            paddingVertical: 10
        }}>
            <Text style={{
                color: theme.textColor,
                fontSize: 20,
                fontWeight: 'bold',
                marginLeft: 23,
                marginBottom: 10
            }}>{lang ? 'Poengtavle' : 'Leaderboard'}</Text>
            <Header />
            <ScrollView showsVerticalScrollIndicator={false}>
                {scores.sort((a, b) => b.score - a.score).map((score) => {
                    return (
                        <View key={score.name} style={{
                            flexDirection: 'row', 
                            justifyContent: 'space-between',
                            marginHorizontal: 25
                        }}>
                            <Text style={{ 
                                color: theme.textColor,
                                fontSize: 18
                                
                            }}>{score.name}</Text>
                            <Text style={{ 
                                color: theme.textColor,
                                fontSize: 18

                            }}>{score.score}</Text>
                        </View>
                    )
                })}
            </ScrollView>
        </View>
    )
}

function Header() {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { lang } = useSelector((state: ReduxState) => state.lang)

    return (
        <View style={{
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            marginHorizontal: 25
        }}>
            <Text style={{ 
                color: theme.textColor,
                fontSize: 18,
                fontWeight: 'bold'
            }}>
                {lang ? 'Navn' : 'Name'}
            </Text>
            <Text style={{ 
                color: theme.textColor,
                fontSize: 18,
                fontWeight: 'bold'
            }}>
                {lang ? 'Poengsum' : 'Score'}
            </Text>
        </View>
    )
}
