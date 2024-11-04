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

    // Control dice roll start/stop
    const [startRoll, setStartRoll] = useState(false);

    async function startGame() {
        const id = await createLobby();

        if (id) {
            setGameID(id);
            joinLobby(id, name);
        }
    }

    const handleRollComplete = () => {
        setStartRoll(false);
    };

    return (
        <SafeAreaView style={{ backgroundColor: theme.background, height }}>
            <View style={{paddingHorizontal: 8}}>
                <Text style={{ color: theme.titleTextColor, fontSize: 30, fontWeight: 'bold', paddingTop: 32}}>
                    {lang ? "Terning" : "Dice game"}
                </Text>
                {gameID && (
                    <Text style={{ color: theme.textColor, fontSize: 20 }}>
                        {`\n${lang ? "Spill ID" : "Game ID"} - ${gameID}`}
                    </Text>
                )}
                {!gameID && <Button handler={startGame} text={lang ? 'Start spillet' : 'Start game'} />}
                <PlayerList gameID={gameID} />

                <DiceRoller startRoll={startRoll} onRollComplete={handleRollComplete} />
            </View>
        </SafeAreaView>
    );
}
