import { Text } from "react-native"
import { useSelector } from "react-redux"

export default function Rules({show}: {show: boolean}) {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const text = lang 
        ? "Kort forklaring på spill regler og hvordan" 
        : "Short explanation of game rules and how to play"

    if (!show) {
        return null
    }

    return (
        <Text style={{ 
            color: theme.textColor, 
            fontSize: 15, 
            marginTop: 8, 
            marginBottom: 8 
        }}>
            {text}
        </Text>
    )
}
