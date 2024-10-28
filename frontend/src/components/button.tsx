import { Text, TouchableOpacity } from "react-native"
import { useSelector } from "react-redux"

type ButtonProps = {
    handler: () => void
    text: string
}

export default function Button({handler, text}: ButtonProps) {
    const { theme } = useSelector((state: ReduxState) => state.theme)

    return (
        <TouchableOpacity
            style={{
                borderRadius: 260,
                paddingBottom: 80,
                paddingTop: 80,
                marginLeft: 30,
                marginVertical: 15, // Adds vertical space between buttons
                width: 350,
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: theme.contrast,
            }} 
            onPress={handler}
        >
            <Text style={{
                display: 'flex',
                flexWrap: 'nowrap',
                padding: 70,
                color: 'white',
                fontWeight: 'bold',
                fontSize: 28
            }}>{text}</Text>
        </TouchableOpacity>
    )
}