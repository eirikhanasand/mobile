import { Dimensions, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
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
            <View style={{paddingHorizontal: 8, gap: 8 }}>
                <Field
                    title={lang ? "Navn" : "Name"} 
                    text={name} 
                    setText={setLocalName} 
                    placeholder={lang ? "Ola" : "Steve"}
                />
                <Text style={{ color: theme.textColor, fontSize: 30, fontWeight: 'bold'}}>
                    {lang ? "Innstillinger" : "Settings"}
                </Text>
                <Button handler={handleThemeChange} text={isDark 
                        ? lang ? "Lyst" : "Light"
                        : lang ? "Mørkt" : "Dark"
                } />
                <Button handler={handleLangChange} text={lang ? "English" : "Norsk"} />
            </View>
        </SafeAreaView>
    )
}

