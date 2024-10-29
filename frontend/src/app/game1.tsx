import Button from '@components/button';
import PlayerList from '@components/playerList';
import { createLobby, getLobby, joinLobby } from '@utils/lobby';
import { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Questions from './questions2';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function Game1() {
    const { lang } = useSelector((state: ReduxState) => state.lang);
    const { theme } = useSelector((state: ReduxState) => state.theme);
    const { name } = useSelector((state: ReduxState) => state.name);
    const height = Dimensions.get('window').height;

    // State variables
    const [gameID, setGameID] = useState<string | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
    const [roundStarted, setRoundStarted] = useState<boolean>(false);
    const [askedQuestions, setAskedQuestions] = useState<number[]>([]);
    const [finished, setFinished] = useState<boolean>(false);
    const [players, setPlayers] = useState<string[]>([]);
    const [showExplanation, setShowExplanation] = useState<boolean>(true);
    const [showGameID, setShowGameID] = useState<boolean>(true);

    // Categories filter
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    // Categories list
    const categories = ["Kind", "Bold", "NTNU"];

    // Function to toggle category selection
    function toggleCategory(category: string) {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(cat => cat !== category)
                : [...prev, category]
        );
    }

    // Filter questions based on selected categories
    function getFilteredQuestions() {
        return Questions.filter(question =>
            selectedCategories.every(cat => question.categories.includes(cat))
        );
    }

    // Start the game when the component mounts
    async function startGame() {
        const id = await createLobby();
        if (id) {
            setGameID(id);
            joinLobby(id, name);
            fetchPlayers(id);
            setShowExplanation(false);
        }
    }

    // Fetch players in the lobby
    async function fetchPlayers(lobbyID: string) {
        const lobby = await getLobby(lobbyID);
        if (lobby && Array.isArray(lobby.players)) {
            setPlayers(lobby.players);
        } else {
            console.error('Invalid lobby structure or no players found');
        }
    }

    // Replace {player} placeholder with a random player
    function replacePlaceholders(question: string, players: string[]) {
        return question.replace(/{player}/g, () => {
            const randomIndex = Math.floor(Math.random() * players.length);
            return players[randomIndex];
        });
    }

    // Start a new round with a random filtered question
    async function startRound() {
        const filteredQuestions = getFilteredQuestions();
        if (filteredQuestions.length === 0) {
            setCurrentQuestion(lang ? "Ingen spørsmål i denne kategorien" : "No questions in this category");
            return;
        }

        let randomQuestion;
        do {
            randomQuestion = filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
        } while (askedQuestions.includes(randomQuestion.id) && askedQuestions.length < filteredQuestions.length);

        if (randomQuestion) {
            const questionText = lang ? randomQuestion.title_no : randomQuestion.title_en;
            setCurrentQuestion(replacePlaceholders(questionText, players));
            setAskedQuestions([...askedQuestions, randomQuestion.id]);
        }
        setRoundStarted(true);
        setShowGameID(false);
    }

    // Render the component
    return (
        <SafeAreaView style={{ backgroundColor: theme.background, height }}>
            <View style={{paddingHorizontal: 8, paddingTop: 32}}>
            <View style={styles.button}>
                <Text style={{ color: theme.titleTextColor, fontSize: 30, fontWeight: 'bold' }}>
                    {lang ? "100 Spørsmål" : "100 questions"}
                </Text>
                {showGameID && gameID && (
                    <Text style={{ color: theme.textColor, fontSize: 20 }}>
                        {`\n${lang ? "Spill ID" : "Game ID"} - ${gameID}`}
                    </Text>
                )}
            </View>
                {showExplanation && (
                    <Text style={{ color: theme.textColor, fontSize: 15, marginTop: 8, marginBottom: 8 }}>
                        {lang ? 
                            "Kort forklaring på spill regler og hvordan" : 
                            "Short explanation of game rules and how to play"}
                    </Text>
                )}
                {!roundStarted && (
                    <>
                        {!gameID && <Button handler={startGame} text={lang ? "Lag en lobby" : "Create a lobby"} />}
                        <PlayerList gameID={gameID} />
                        {gameID && <Button handler={startRound} text={lang ? "Start" : "Start"} />}
                    </>
                )}

                {roundStarted && !finished && currentQuestion && (
                    <>
                        <View style={[styles.questionBox, { backgroundColor: theme.blue }]}>
                            <Text style={{ color: theme.textColor, fontSize: 20 }}>{currentQuestion}</Text>
                        </View>
                        <Button handler={startRound} text={lang ? "Neste spørsmål" : "Next question"} />
                    </>
                )}

                {finished && (
                    <Text style={{ color: theme.textColor, fontSize: 20, marginTop: 20 }}>
                        {lang ? "Ferdig" : "Finished"}
                    </Text>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    filterButton: {
        padding: 8,
        margin: 4,
        borderWidth: 1,
        borderRadius: 4,
    },
    selectedFilter: {
        backgroundColor: '#cccccc',
    },
    questionBox: {
        borderWidth: 1,
        padding: 16,
        borderRadius: 8,
        marginVertical: 16,
    },
    button: {
        marginVertical: 8,
    },
});
