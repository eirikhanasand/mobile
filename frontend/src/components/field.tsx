import { Dispatch, SetStateAction } from "react"
import { Text, TextInput, View } from "react-native"
import { useSelector } from "react-redux"

type NameProps = {
    title: string
    placeholder?: string
    text: string | null
    autoFocus?: true
    setText: Dispatch<SetStateAction<string | null>>
}

export default function Field({title, placeholder, autoFocus, text, setText}: NameProps) {
    const { theme } = useSelector((state: ReduxState) => state.theme)
        
    function getText() {
        if (text === null || text === "pending") {
            return ''
        }

        return text
    }

    return (
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <View style={{ alignSelf: 'flex-start', marginBottom: 8 }}>
                <Text style={{
                    color: theme.textColor,
                    fontSize: 20,
                    fontWeight: 'bold',
                }}>
                    {title}
                </Text>
            </View>
            <TextInput
                style={{
                    backgroundColor: theme.contrast,
                    color: theme.textColor,
                    width: 250,
                    height: 50,
                    borderRadius: 8,
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 8,
                    fontSize: 24
                }}
                value={getText()}
                placeholder={placeholder}
                placeholderTextColor={theme.titleTextColor}
                textAlign="center"
                onChangeText={(val) => setText(val)}
                autoFocus={autoFocus}
                selectionColor={theme.orange}
            />
        </View>
    )
}