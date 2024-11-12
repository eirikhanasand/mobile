import { Dimensions, SafeAreaView, Text, View, ScrollView, Platform } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { changeLang } from '../redux/lang'
import { changeTheme } from '../redux/theme'
import Field from '@components/field'
import { setName } from '@redux/name'
import { useEffect, useState } from 'react'
import SmallButton from '@components/smallButtons'
import { toggleMusic } from '@redux/music'
import { Audio } from 'expo-av'

let backgroundMusic: Audio.Sound | null = null

export default function SettingsScreen() {
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const { theme, isDark } = useSelector((state: ReduxState) => state.theme)
    const { name: GlobalName } = useSelector((state: ReduxState) => state.name)
    const [name, setLocalName] = useState<string | null>(GlobalName)
    const dispatch = useDispatch()
    const height = Dimensions.get('window').height
    const { playing } = useSelector((state: ReduxState) => state.music)

    function handleThemeChange() {
        dispatch(changeTheme())
    }

    function handleLangChange() {
        dispatch(changeLang())
    }

    useEffect(() => {
        async function loadMusic() {
            if (!backgroundMusic) {
                const { sound } = await Audio.Sound.createAsync(
                    require('@assets/music/bubbles.mp3')
                )
                backgroundMusic = sound
                await backgroundMusic.setIsLoopingAsync(true)
            }
        }

        loadMusic()

        return () => {
            backgroundMusic?.unloadAsync()
        }
    }, [])

    function handleMusic() {
        dispatch(toggleMusic())

        if (playing) {
            backgroundMusic?.stopAsync()
        } else {
            backgroundMusic?.playAsync()
        }
    }

    useEffect(() => {
        dispatch(setName(name))
    }, [name])

    return (
        <SafeAreaView style={{backgroundColor: theme.background, height }}>
            <ScrollView style={{paddingHorizontal: 16, gap: 16 }}>
            <Text style={{ 
                color: theme.titleTextColor, 
                fontSize: 30, 
                fontWeight: 'bold', 
                paddingTop: Platform.OS !== "ios" ? 40 : undefined,
                marginBottom: 16 
            }}>
                {lang ? "Innstillinger" : "Settings"}
            </Text>
            <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                marginBottom: 8 
            }}>
                <Text style={{ 
                    color: theme.textColor, 
                    fontSize: 20, 
                    fontWeight: 'bold' 
                }}>
                    {lang ? "Navn: " : "Name: "}
                </Text>
                <View style={{ marginLeft: 16 }}>
                        <Field
                            title=""
                            text={name}
                            setText={setLocalName}
                            placeholder={lang ? "Ola" : "Steve"}
                        />
                    </View>
                </View>
                <View style={{ 
                    flexDirection: 'column', 
                    alignItems: 'flex-start', 
                    marginBottom: 8, 
                    marginTop: 16 
                }}>
                    <View style={{ 
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        marginBottom: 8 
                    }}>
                        <Text style={{ 
                            color: theme.textColor, 
                            fontSize: 20, 
                            width: 120 
                        }}>
                            {lang ? "Bytt modus:" : "Change mode:"}
                        </Text>
                        <SmallButton 
                            handler={handleThemeChange} 
                            text={isDark 
                                ? (lang ? "Lyst" : "Light") 
                                : (lang ? "Mørkt" : "Dark")
                            } 
                        />
                    </View>
                    <View style={{ 
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        marginBottom: 8 
                    }}>
                        <Text style={{ 
                            color: theme.textColor, 
                            fontSize: 20, 
                            width: 120 
                        }}>
                            {lang ? "Bytt språk:" : "Change language:"}
                        </Text>
                        <SmallButton 
                            handler={handleLangChange} 
                            text={lang ? "English" : "Norsk"} 
                        />
                    </View>
                    <View style={{ 
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        marginBottom: 8 
                    }}>
                        <Text style={{ 
                            color: theme.textColor, 
                            fontSize: 20, 
                            width: 120 
                        }}>
                            {lang ? "Musikk:" : "Music:"}
                        </Text>
                        <SmallButton 
                            handler={handleMusic} 
                            text={playing 
                                ? (lang ? "Skru av" : "Turn off") 
                                : (lang ? "Skru på" : "Turn on")
                            } 
                        />
                    </View>
                </View>
                <View style={{ height: 64 }} />
            </ScrollView>
        </SafeAreaView>
    )
}
