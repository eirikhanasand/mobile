import DiceRoller from '@components/diceRoller'
import { useState } from 'react'
import { Dimensions, Platform, SafeAreaView, Text, View } from 'react-native'
import { useSelector } from 'react-redux'

export default function Dice() {
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const height = Dimensions.get('window').height

    // Control dice roll start / stop
    const [startRoll, setStartRoll] = useState(false)

    function handleRollComplete() {
        setStartRoll(false)
    }

    return (
        <SafeAreaView style={{ backgroundColor: theme.background, height }}>
            <View style={{paddingHorizontal: 8}}>
                <Text style={{ 
                    color: theme.titleTextColor, 
                    fontSize: 30, 
                    fontWeight: 'bold', 
                    textAlign: 'center',
                    paddingTop: Platform.OS !== "ios" ? 40 : undefined,
                }}>
                    {lang ? "Terning" : "Dice"}
                </Text>
                <DiceRoller 
                    startRoll={startRoll} 
                    onRollComplete={handleRollComplete} 
                />
            </View>
        </SafeAreaView>
    )
}
