import { postQuestion } from "@utils/lobby"
import { useEffect, useState } from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"
import { useSelector } from "react-redux"

export default function PostQuestion() {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const { gameID } = useSelector((state: ReduxState) => state.game)
    const [displayEffect, setDisplayEffect] = useState(false)
    const [title_no, setTitle_no] = useState("")
    const [title_en, setTitle_en] = useState("")

    async function sendQuestion() {
        postQuestion(gameID, {title_no, title_en})
        setTitle_no("")
        setTitle_en("")
        setDisplayEffect(true)
    }

    useEffect(() => {
        if (displayEffect) {
            setTimeout(() => {
                setDisplayEffect(false)
            }, 2000)
        }
    }, [displayEffect])

    return (
        <>
            <View style={{ 
                backgroundColor: theme.contrast, 
                width: '100%', 
                marginTop: 50, 
                borderRadius: 8, 
                padding: 20
            }}>
                <Text style={{
                    color: theme.textColor, 
                    fontSize: 20, 
                    fontWeight: 'bold', 
                    marginBottom: 10
                }}>
                    {lang ? 'Legg til eget spørsmål' : 'Add custom question'}
                </Text>
                <View>
                    <Text style={{ 
                            color: theme.textColor, 
                            borderRadius: 8,
                            fontWeight: 'bold',
                            marginBottom: 5
                        }}>Norsk spørsmål</Text>
                    <TextInput 
                        style={{ 
                            color: theme.textColor, 
                            backgroundColor: theme.trackColor, 
                            borderRadius: 8,
                            height: 30,
                            paddingLeft: 10
                        }}
                        value={title_no}
                        onChangeText={(e) => setTitle_no(e)}
                        placeholder="Norsk spørsmål"
                        placeholderTextColor={theme.textColor}
                    />
                </View>
                <View style={{marginTop: 20}}>
                    <Text style={{ 
                            color: theme.textColor, 
                            borderRadius: 8,
                            fontWeight: 'bold',
                            marginBottom: 5
                        }}>English question</Text>
                    <TextInput 
                        style={{ 
                            color: theme.textColor, 
                            backgroundColor: theme.trackColor, 
                            borderRadius: 8,
                            height: 30,
                            paddingLeft: 10
                        }}
                        value={title_en}
                        onChangeText={(e) => setTitle_en(e)}
                        placeholder="English question"
                        placeholderTextColor={theme.textColor}
                    />
                </View>
                <TouchableOpacity onPress={sendQuestion} style={{
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    marginTop: 20,
                    backgroundColor: theme.trackColor,
                    height: 40,
                    borderRadius: 8
                }}>
                    <Text style={{color: theme.textColor, fontWeight: 'bold'}}>
                        {lang ? 'Legg til' : 'Add'}
                    </Text>
                </TouchableOpacity>
            </View>
            {displayEffect && <View style={{
                justifyContent: 'center', 
                alignItems: 'center', 
                marginTop: 20,
                backgroundColor: 'green',
                height: 50,
                borderRadius: 8
            }}>
                <Text style={{color: theme.textColor}}>
                    {lang ? 'Sendte spørsmålet!' : 'Sent question!'}
                </Text>
            </View>}
        </>
    )
}