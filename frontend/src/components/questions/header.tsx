import FilterButtons from "@components/filterButtons"
import Leave from "@components/leave"
import { setGame } from "@redux/game"
import { setStatus } from "@utils/card"
import { kick } from "@utils/lobby"
import { useNavigation } from "expo-router"
import { Dispatch, SetStateAction } from "react"
import { Platform, Text, TouchableOpacity, View } from "react-native"
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types"
import { useDispatch, useSelector } from "react-redux"

type HeaderProps = {
    roundStarted: boolean
    setRoundStarted: Dispatch<SetStateAction<boolean>>
}

export default function Header({roundStarted, setRoundStarted}: HeaderProps) {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const { gameID } = useSelector((state: ReduxState) => state.game)
    const { name } = useSelector((state: ReduxState) => state.name)
    const navigation = useNavigation<NativeStackNavigationProp<any>>()
    const dispatch = useDispatch()
    const gameModeText = lang ? 'Gjett' : 'Guess'

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

    return (
        <>
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
                    style={{ 
                        position: 'absolute', 
                        right: 0, 
                        paddingTop: Platform.OS !== "ios" 
                            ? 40 
                            : undefined 
                    }} 
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
                {roundStarted && <TouchableOpacity
                    style={{
                        padding: 8,
                        margin: 4,
                        borderWidth: 1,
                        borderRadius: 4,
                    }}
                    onPress={switchGameMode}
                >
                    <Text style={{ color: theme.textColor }}>
                        {gameModeText}
                    </Text>
                </TouchableOpacity>}
            </View>
        </>
    )
}
