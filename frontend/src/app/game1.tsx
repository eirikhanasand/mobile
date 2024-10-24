import Button from '@components/button'
import PlayerList from '@components/playerList'
import { createLobby, getLobby, joinLobby } from '@utils/lobby'
import { useEffect, useState } from 'react'
import { Dimensions, SafeAreaView, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import Questions from './questions2'

export default function Game1() {
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { name } = useSelector((state: ReduxState) => state.name)
    const height = Dimensions.get('window').height
    const [gameID, setGameID] = useState<string | null>(null)
    const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
    const [roundStarted, setRoundStarted] = useState<boolean>(false);
    const [askedQuestions, setAskedQuestions] = useState<number[]>([]);
    const [finished, setFinished] = useState<boolean>(false);

    // Replace with actual players from lobby
    const players = ["Alice", "Bob"];

    async function startGame() {
        const id = await createLobby()

        if (id) {
            setGameID(id)
            joinLobby(id, name)
        }
    }

    function replacePlaceholders(question: string, players: string[]) {
        return question.replace(/{player}/g, () => {
            const randomIndex = Math.floor(Math.random() * players.length);
            return players[randomIndex];
        });
    }

    async function startRound() {
        // Use the questions from questions2.ts
        console.log("Starting round with questions:");

        // Select a random question with ID between 1 and 10 that hasn't been asked yet
        let randomID: number;
        let question;
        do {
            randomID = Math.floor(Math.random() * 10) + 1;
            question = Questions.find(question => question.id === randomID);
        } while (askedQuestions.includes(randomID) && askedQuestions.length < 10);

        if (question) {
            const questionText = lang ? question.title_no : question.title_en;
            setCurrentQuestion(replacePlaceholders(questionText, players));
            setAskedQuestions([...askedQuestions, randomID]);
        }
        setRoundStarted(true);
    }

    async function nextQuestion() {
        if (askedQuestions.length >= 10) {
            setFinished(true);
            return;
        }
        // Select the next random question that hasn't been asked yet
        let randomID: number;
        let question;
        do {
            randomID = Math.floor(Math.random() * 10) + 1;
            question = Questions.find(question => question.id === randomID);
        } while (askedQuestions.includes(randomID) && askedQuestions.length < 10);

        if (question) {
            const questionText = lang ? question.title_no : question.title_en;
            setCurrentQuestion(replacePlaceholders(questionText, players));
            setAskedQuestions([...askedQuestions, randomID]);
        }
    }

    return (
        <SafeAreaView style={{ backgroundColor: theme.background, height }}>
            <View style={{paddingHorizontal: 8, paddingTop: 32}}>
                <Text style={{ color: theme.textColor, fontSize: 30, fontWeight: 'bold'}}>
                    {lang ? "100 Spørsmål" : "100 questions"}
                    {gameID ? `\n${lang ? "Spill ID" : "Game ID"} - ${gameID}` : ''}
                </Text>
                {!roundStarted && (
                    <>
                    {!gameID && <Button handler={startGame} text={lang ? "Start spillet" : "Start game"} />}
                    <PlayerList gameID={gameID} />
                    {gameID && <Button handler={startRound} text={lang ? "Start" : "Start"} />}
                    </>
                )}
                {roundStarted && !finished && currentQuestion && (
                    <>
                        <Text style={{ color: theme.textColor, fontSize: 20, marginTop: 20 }}>
                            {currentQuestion}
                        </Text>
                        <Button handler={nextQuestion} text={lang ? "Neste spørsmål" : "Next question"} />
                    </>
                )}
                {finished && (
                    <Text style={{ color: theme.textColor, fontSize: 20, marginTop: 20 }}>
                        {lang ? "Ferdig" : "Finished"}
                    </Text>
                )}
            </View>
        </SafeAreaView>
    )
}
