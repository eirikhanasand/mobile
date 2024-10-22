import { Dimensions, SafeAreaView, Text, View } from 'react-native'
import { useSelector } from "react-redux"

export default function HomeScreen() {
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const height = Dimensions.get('window').height

    return (
        <SafeAreaView style={{backgroundColor: theme.background, height }}>
            <View style={{paddingHorizontal: 8}}>
                <Text style={{ color: theme.textColor, fontSize: 30, fontWeight: 'bold'}}>
                    {lang ? "Velkommen!" : "Welcome!"}
                </Text>
            </View>
        </SafeAreaView>
    )
}
