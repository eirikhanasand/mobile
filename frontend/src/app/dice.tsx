import Button from '@components/button'
import { Dimensions, SafeAreaView, Text, View, Image } from 'react-native'
import { useSelector } from 'react-redux'
import { DiceGIF } from '@constants'
import React, { useEffect, useState } from 'react'

export default function Dice() {
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const height = Dimensions.get('window').height
    const [isRolling, setIsRolling] = useState(false)
    const [startRoll, setStartRoll] = useState(false)
    const dice = { width: 200, height: 200 }

    const diceImages = [
        require('../../public/assets/images/dice_1.png'),
        require('../../public/assets/images/dice_2.png'),
        require('../../public/assets/images/dice_3.png'),
        require('../../public/assets/images/dice_4.png'),
        require('../../public/assets/images/dice_5.png'),
        require('../../public/assets/images/dice_6.png')
    ]

    const [currentDice, setCurrentDice] = useState(diceImages[0])

    useEffect(() => {
        if (startRoll) {
            rollDice()
        }
    }, [startRoll])

    function rollDice() {
        setIsRolling(true)

        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * diceImages.length)
            setCurrentDice(diceImages[randomIndex])
            setIsRolling(false)
            setStartRoll(false)
        }, 1500)
    }

    return (
        <SafeAreaView style={{ backgroundColor: theme.background, height }}>
            <View style={{paddingHorizontal: 8}}>
                <Text style={{ color: theme.titleTextColor, fontSize: 30, fontWeight: 'bold', paddingTop: 32}}>
                    {lang ? "Terning" : "Dice"}
                </Text>
                {<Button handler={() => setStartRoll(true)} text={lang ? 'Kast terning' : 'Throw dice'} />}
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Image source={isRolling ? { uri: DiceGIF } : currentDice} style={dice} />
                </View>
            </View>
        </SafeAreaView>
    )
}
