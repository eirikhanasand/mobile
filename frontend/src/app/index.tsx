import Button from '@components/button'
import Field from '@components/field'
import SmallButton from '@components/smallButtons'
import { joinLobby } from '@utils/lobby'
import { useNavigation } from 'expo-router'
import { Dispatch, SetStateAction, useState } from 'react'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types'
import { useDispatch, useSelector } from "react-redux"
import { setName } from '@redux/name'
import { setGame, setJoined } from '@redux/game'
import { ScrollView } from 'react-native'
import { Alert, Dimensions, Text, TouchableOpacity, View } from 'react-native'

type PromptProps = {
    id: string | null
    setID: Dispatch<SetStateAction<string | null>>
    name: string | null
}

export default function HomeScreen() {
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { name } = useSelector((state: ReduxState) => state.name)
    const { joined } = useSelector((state: ReduxState) => state.game)
    const height = Dimensions.get('window').height
    const navigation = useNavigation<NativeStackNavigationProp<any>>()
    const [id, setID] = useState<string | null>(null)
    const dispatch = useDispatch()

    const dicePicture = require('@assets/images/dice.jpg')
    const oneHundredQuestionsPicture = require('@assets/images/100q.jpg')
    const joinGamePicture = require('@assets/images/joinGame.jpg')
    const cardsGamePicture = require('@assets/images/cardsGame.jpg')

    // Navigation handler for game 1
    function handle100Q() {
        dispatch(setGame(null))
        navigation.navigate("100q")
    }
    
    // Navigation handler for dice
    function handleDice() {
        dispatch(setGame(null))
        navigation.navigate("dice")
    }

    // Navigation handler for Guess (playing cards)
    function handleCards() {
        dispatch(setGame(null))
        navigation.navigate("guess")
    }

    function promptGame() {
        setID("pending")
        dispatch(setJoined(false))
    }

    return ( 
        <ScrollView 
            style={{backgroundColor: theme.background, height, gap: 8 }}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={100}
        >
            <View style={{paddingHorizontal: 8}}>
                <Text style={{ 
                    color: theme.titleTextColor, 
                    fontSize: 60, 
                    fontWeight: 'bold', 
                    paddingTop: 40, 
                    textAlign: 'center'
                }}> 
                    {"Bubbles"}
                </Text>
            </View> 
            <View style={{alignItems: 'center', gap: 30}}>
                <Button 
                    handler={promptGame} 
                    text={lang ? "Bli med i spill" : "Join game"} 
                    backgroundImage={joinGamePicture}
                />
                <Button 
                    handler={handle100Q} 
                    text={lang ? "100 spørsmål" : "100 questions"} 
                    backgroundImage={oneHundredQuestionsPicture}
                /> 
                <Button 
                    handler={handleDice} 
                    text={lang ? "Terning" : "Dice"} 
                    backgroundImage={dicePicture}
                />   
                <Button 
                    handler={handleCards} 
                    text={lang ? "Gjett" : "Guess"} 
                    backgroundImage={cardsGamePicture}
                /> 
            </View>
            {!name && <PromptName />}
            {id !== null && !joined && <Prompt 
                id={id} 
                setID={setID} 
                name={name} 
            />} 
        </ScrollView>
    ) 
}

function PromptName() {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { lang } = useSelector((state: ReduxState) => state.lang)   
    const [name, setLocalName] = useState<string | null>(null)
    const dispatch = useDispatch()

    function updateName() {
        dispatch(setName(name))
    }

    return (
        <View style={{
            position: 'absolute',
            backgroundColor: theme.transparentAndroid,
            height: '100%',
            width: '100%',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingTop: 150
        }}>
            <View 
                onStartShouldSetResponder={() => true}
                onTouchEnd={(e) => e.stopPropagation()} 
                style={{
                    width: '80%',
                    height: '25%',
                    borderRadius: 20,
                    justifyContent: 'flex-start',
                    padding: 16,
                    gap: 8,
                    paddingBottom: 100,
                }}
            >
                <Field
                    title={lang ? "Navn" : "Name"} 
                    text={name} 
                    setText={setLocalName} 
                    placeholder={lang ? "Ola" : "Steve"}
                    autoFocus={true}
                />
                <View style={{ marginTop: 16, alignItems: 'center' }}>
                    <SmallButton handler={updateName} text={lang ? "Klar" : "Ready"} />
                </View>
            </View>
        </View>
    )
}
function Prompt({id, setID, name}: PromptProps) {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const navigation = useNavigation<NativeStackNavigationProp<any>>()
    const dispatch = useDispatch()

    async function joinGame() {
        if (id === "pending") {
            return
        }
        
        if (id && name) {
            const lobby = await joinLobby(id, name)

            if (lobby === 409) {
                Alert.alert(lang ? `Lobby ${id} er full.` : `Lobby ${id} is full.`)
            } else if (lobby === 404) {
                Alert.alert(lang ? `Lobby ${id} finnes ikke.` : `Lobby ${id} does not exist.`)
            } else if (lobby) {
                dispatch(setJoined(true))
                dispatch(setGame(id))
                navigation.navigate("joined")
            }
        }
    }

    function handleCancel() {
        setID(null)
    }

    return (
        <TouchableOpacity onPress={handleCancel} activeOpacity={1} style={{
            position: 'absolute',
            backgroundColor: theme.transparentAndroid,
            height: '100%',
            width: '100%',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingTop: 100
        }}>
            <View 
                onStartShouldSetResponder={() => true}
                onTouchEnd={(e) => e.stopPropagation()} 
                style={{
                    borderRadius: 20,
                    justifyContent: 'center',
                    padding: 16,
                    gap: 8
                }}
            >
                <Field 
                    title=""
                    placeholder="ID"
                    text={id} 
                    setText={setID}
                    autoFocus={true}
                />
                <View style={{ alignItems: 'center', marginTop: 16 }}>
                    <SmallButton handler={joinGame} text={lang ? "Bli med" : "Join"} />
                </View>
            </View>
        </TouchableOpacity>
    )
}
