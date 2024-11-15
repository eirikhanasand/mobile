import React, { useEffect, useState } from 'react'
import { DiceGIF } from '@constants'
import { Image, View, TouchableOpacity } from 'react-native'

type DiceRollerProps = {
    startRoll: boolean
    onRollComplete: () => void
}

export default function DiceRoller({ startRoll, onRollComplete }: DiceRollerProps) {
    const [isRolling, setIsRolling] = useState(false)

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
        if (isRolling) return

        setIsRolling(true)
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * diceImages.length)
            setCurrentDice(diceImages[randomIndex])
            setIsRolling(false)
            onRollComplete()
        }, 1500)
    }

    return (
        <View style={{ 
            alignItems: 'center', 
            justifyContent: 'center', 
            paddingTop: 100 
        }}>
            <TouchableOpacity onPress={rollDice} disabled={isRolling}>
                {isRolling ? (
                    <Image
                        source={{ uri: DiceGIF }}
                        style={{ width: 300, height: 300 }}
                    />
                ) : (
                    <Image
                        source={currentDice}
                        style={{ width: 300, height: 300 }}
                    />
                )}
            </TouchableOpacity>
        </View>
    )
}
