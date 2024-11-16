import { Text } from "react-native"
import { useSelector } from "react-redux"

export default function Finished({finished}: {finished: boolean}) {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { lang } = useSelector((state: ReduxState) => state.lang)

    if (!finished) {
        return <></>
    }

    return (
        <Text style={{ color: theme.textColor, fontSize: 20, marginTop: 20 }}>
            {lang ? "Ferdig" : "Finished"}
        </Text>
    )
}
