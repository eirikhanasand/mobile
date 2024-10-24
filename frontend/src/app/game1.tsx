import Button from '@components/button'
import PlayerList from '@components/playerList'
import { createLobby, getLobby, joinLobby } from '@utils/lobby'
import { useEffect, useState } from 'react'
import { Dimensions, SafeAreaView, Text, View } from 'react-native'
import { useSelector } from 'react-redux'

export default function Game1() {
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { name } = useSelector((state: ReduxState) => state.name)
    const height = Dimensions.get('window').height
    const [gameID, setGameID] = useState<string | null>(null)

    async function startGame() {
        const id = await createLobby()

        if (id) {
            setGameID(id)
            joinLobby(id, name)
        }
    }

    async function startRound() {
        // start the round
    }

    return (
        <SafeAreaView style={{ backgroundColor: theme.background, height }}>
            <View style={{paddingHorizontal: 8, paddingTop: 32}}>
                <Text style={{ color: theme.textColor, fontSize: 30, fontWeight: 'bold'}}>
                    {lang ? "100 Spørsmål" : "100 questions"}
                    {lang ? "\nSpill ID" : "Game ID"}
                    {gameID ? ` - ${gameID}`: ''}
                </Text>
                {!gameID && <Button handler={startGame} text={lang ? "Start spillet" : "Start game"} />}
                <PlayerList gameID={gameID} />
                {gameID && <Button handler={startRound} text={lang ? "Start" : "Start"} />}
            </View>
        </SafeAreaView>
    )
}
