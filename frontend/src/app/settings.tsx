import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { changeLang } from '../redux/lang'
import { changeTheme } from '../redux/theme'
import Button from '@components/button'
import Field from '@components/field'
import { setName } from '@redux/name'
import { useEffect, useState } from 'react'

export default function ExploreScreen() {
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const { theme, isDark } = useSelector((state: ReduxState) => state.theme)
    const { name: GlobalName } = useSelector((state: ReduxState) => state.name)
    const [name, setLocalName] = useState<string | null>(GlobalName)
    const dispatch = useDispatch()
    const height = Dimensions.get('window').height

    function handleThemeChange() {
        dispatch(changeTheme())
    }

    function handleLangChange() {
        dispatch(changeLang())
    }

    useEffect(() => {
        dispatch(setName(name))
    }, [name])

    return (
        <SafeAreaView style={{backgroundColor: theme.background, height }}>
            <ScrollView style={{paddingHorizontal: 16, gap: 16 }}>
                <Text style={{ color: theme.titleTextColor, fontSize: 30, fontWeight: 'bold', paddingTop: 32, marginBottom: 16}}>
                    {lang ? "Innstillinger" : "Settings"}
                </Text>
                <Field
                    title={lang ? "Navn: " : "Name: "} 
                    text={name} 
                    setText={setLocalName} 
                    placeholder={lang ? "Ola" : "Steve"}
                />
                <Text style={{ color: theme.textColor, fontSize: 20, marginBottom: 8 , marginTop: 16}}>
                    {lang ? "Bytt modus:" : "Change mode:"}
                </Text>
                <Button handler={handleThemeChange} text={isDark ? (lang ? "Lyst" : "Light") : (lang ? "Mørkt" : "Dark")} />
                <Text style={{ color: theme.textColor, fontSize: 20, marginBottom: 8, marginTop: 16 }}>
                    {lang ? "Bytt språk:" : "Change language:"}
                </Text>
                <Button handler={handleLangChange} text={lang ? "English" : "Norsk"} />
                <View style={{ height: 64 }} />
            </ScrollView>
        </SafeAreaView>
    )
}
