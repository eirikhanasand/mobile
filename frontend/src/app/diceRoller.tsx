// DiceRoller.tsx
import React, { useEffect, useState } from 'react';
import { Image, View } from 'react-native';

interface DiceRollerProps {
    startRoll: boolean;
    onRollComplete: () => void;
}

const DiceRoller: React.FC<DiceRollerProps> = ({ startRoll, onRollComplete }) => {
    const [isRolling, setIsRolling] = useState(false);

    const diceImages = [ // can make new ones for the dark screen
        require('../../public/assets/images/dice_1.png'),
        require('../../public/assets/images/dice_2.png'),
        require('../../public/assets/images/dice_3.png'),
        require('../../public/assets/images/dice_4.png'),
        require('../../public/assets/images/dice_5.png'),
        require('../../public/assets/images/dice_6.png')
    ];

    const [currentDice, setCurrentDice] = useState(diceImages[0]);

    useEffect(() => {
        if (startRoll) {
            rollDice();
        }
    }, [startRoll]);

    const rollDice = () => {
        setIsRolling(true);

        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * diceImages.length);
            setCurrentDice(diceImages[randomIndex]);
            setIsRolling(false);
            onRollComplete(); // Notify that the roll is complete
        }, 1500);
    };

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            {isRolling ? (
                <Image
                    source={{ uri: 'https://media.giphy.com/media/5xtDarpTZP1hgRgReLK/giphy.gif' }} // gif
                    style={{ width: 300, height: 300 }}
                />
            ) : (
                <Image
                    source={currentDice}
                    style={{ width: 300, height: 300 }}
                />
            )}
        </View>
    );
};

export default DiceRoller;
