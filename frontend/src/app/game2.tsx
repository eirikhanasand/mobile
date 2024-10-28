import Button from '@components/button';
import PlayerList from '@components/playerList';
import { createLobby, joinLobby } from '@utils/lobby';
import { useState } from 'react';
import { Dimensions, SafeAreaView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import DiceRoller from './diceRoller';

export default function Game2() {
    const { lang } = useSelector((state: ReduxState) => state.lang);
    const { theme } = useSelector((state: ReduxState) => state.theme);
    const { name } = useSelector((state: ReduxState) => state.name);
    const height = Dimensions.get('window').height;
    const [gameID, setGameID] = useState<string | null>(null);

    // Define startRoll state to control the dice roll
    const [startRoll, setStartRoll] = useState(false);

    async function startGame() {
        const id = await createLobby();

        if (id) {
            setGameID(id);
            joinLobby(id, name);
        }
    }

    // Function to start the dice roll
    async function startRound() {
        setStartRoll(true); // Trigger the dice roll
    }

    // Callback to reset startRoll after the dice roll is completed
    const handleRollComplete = () => {
        setStartRoll(false);
    };

    return (
        <SafeAreaView style={{ backgroundColor: theme.background, height }}>
            <View style={{ paddingHorizontal: 8 }}>
                <Text style={{ color: theme.textColor, fontSize: 30, fontWeight: 'bold' }}>
                    {lang ? 'Spill 2' : 'Game 2'}
                    {gameID ? ` - ${gameID}` : ''}
                </Text>
                {!gameID && <Button handler={startGame} text={lang ? 'Start spillet' : 'Start game'} />}
                <PlayerList gameID={gameID} />
                {gameID && <Button handler={startRound} text={lang ? 'Kast terning' : 'Throw dice'} />}
                
                {/* Pass startRoll to DiceRoller and reset it after completion */}
                <DiceRoller startRoll={startRoll} onRollComplete={handleRollComplete} />
            </View>
        </SafeAreaView>
    );
}
