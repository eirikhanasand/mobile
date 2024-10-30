import Leave from "@components/leave"
import PlayerList from "@components/playerList"
import { setGame, setJoined } from "@redux/game"
import { getLobby, kick } from "@utils/lobby"
import { useNavigation } from "expo-router"
import { useEffect, useState } from "react"
import { Dimensions, SafeAreaView, Text, TouchableOpacity, View } from "react-native"
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types"
import { useDispatch, useSelector } from "react-redux"

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
                height: text ? '90%' : undefined, 
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
                        color: theme.textColor, 
                        fontSize: 30, 
                        fontWeight: 'bold', 
                        left: 8
                    }}>
                        Lobby - {gameID}
                    </Text>
                    <TouchableOpacity onPress={leave}>
                        <Leave color={theme.textColor} />
                    </TouchableOpacity>
                </View>
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
                    }}>{text}</Text>
                </View>}
            </View>
        </SafeAreaView>
    )
}
