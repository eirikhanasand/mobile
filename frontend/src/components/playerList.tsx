import { MAX_PLAYERS } from "@constants"
import { getLobby, kick } from "@utils/lobby"
import { useState } from "react"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { useSelector } from "react-redux"

type PlayerListProps = {
    gameID: string | null
}

export default function PlayerList({gameID}: PlayerListProps) {
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { name } = useSelector((state: ReduxState) => state.name)
    const [players, setPlayers] = useState([name])
    const leader = players[0] === name ? lang ? "Deg" : "You" : players[0]
    
    async function getPlayers() {
        const lobby = await getLobby(gameID || '')

        if (lobby && lobby.players !== players) {
            setPlayers(lobby.players)
        }
    }

    setTimeout(() => {
        if (gameID) {
            getPlayers()
        }
    }, 1000)

    if (!gameID || !players.length) return null

    return (
        <View style={{
            gap: 8, 
            borderRadius: 20, 
            backgroundColor: theme.contrast, 
            padding: 8,
            marginBottom: 8
        }}>
            <Text style={{
                color: theme.textColor, 
                fontSize: 20, 
                fontWeight: 'bold'
            }}>{lang ? "Leder" : "Leader"}</Text>
            <View>
                <Text style={{color: theme.textColor, fontSize: 18}}>{leader}</Text>
            </View>
            {players.length > 1 && <>
                <Text style={{
                    color: theme.textColor, 
                    fontSize: 20, 
                    fontWeight: 'bold'
                }}>{lang ? "Spillere" : "Players"} ({players.length} / {MAX_PLAYERS})</Text>
                <ScrollView
                    showsVerticalScrollIndicator={false} 
                    scrollEventThrottle={100}
                >
                    {players.splice(1).map((player, index) => (
                        <View 
                            key={index}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Text style={{color: theme.textColor, fontSize: 18}}>{player}</Text>
                            {players[0] === name && <TouchableOpacity onPress={() => kick(gameID || '', player)}>
                                <Text style={{color: theme.textColor, fontSize: 18}}>❌</Text>
                            </TouchableOpacity>}
                        </View>
                    ))}
                </ScrollView>
            </>}
        </View>
    )
}
