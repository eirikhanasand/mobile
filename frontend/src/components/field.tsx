import { Dispatch, SetStateAction } from "react"
import { Text, TextInput } from "react-native"
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
        <>
            <Text style={{
                color: theme.textColor,
                fontSize: 20,
                fontWeight: 'bold',
            }}
            >{title}</Text>
            <TextInput 
                style={{
                    backgroundColor: theme.contrast, 
                    color: theme.textColor,
                    height: 35,
                    borderRadius: 20
                }}
                value={getText()}
                placeholder={placeholder}
                placeholderTextColor={theme.titleTextColor}
                textAlign="center"
                onChangeText={(val) => setText(val)}
                autoFocus={autoFocus}
                selectionColor={theme.orange}
            />
        </>
    )
}