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
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 20,
                height: 35,
                backgroundColor: theme.contrast 
            }} 
            onPress={handler}
        >
            <Text style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 18
            }}>{text}</Text>
        </TouchableOpacity>
    )
}