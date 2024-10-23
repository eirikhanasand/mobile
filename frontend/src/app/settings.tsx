import { Dimensions, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { changeLang } from '../redux/lang'
import { changeTheme } from '../redux/theme'

export default function ExploreScreen() {
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const { theme, isDark } = useSelector((state: ReduxState) => state.theme)
    const dispatch = useDispatch()
    const height = Dimensions.get('window').height

    function handleThemeChange() {
        dispatch(changeTheme())
    }

    function handleLangChange() {
        dispatch(changeLang())
    }

    return (
        <SafeAreaView style={{backgroundColor: theme.background, height }}>
            <View style={{paddingHorizontal: 8, gap: 8 }}>
                <Text style={{ color: theme.textColor, fontSize: 30, fontWeight: 'bold'}}>
                    {lang ? "Innstillinger" : "Settings"}
                </Text>
                <TouchableOpacity 
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 20,
                        height: 35,
                        backgroundColor: theme.contrast 
                    }} 
                    onPress={handleThemeChange}
                >
                    <Text style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 18
                    }}>{isDark 
                        ? lang ? "Lyst" : "Light"
                        : lang ? "Mørkt" : "Dark"
                    }</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 20,
                        height: 35,
                        backgroundColor: theme.contrast 
                    }} 
                    onPress={handleLangChange}
                >
                    <Text style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 18
                    }}>
                        {lang ? "English" : "Norsk"}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

