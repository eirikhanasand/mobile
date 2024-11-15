import { Stack } from 'expo-router'
import { Text, View } from 'react-native'
import { useSelector } from 'react-redux'

export default function NotFoundScreen() {
    const { lang } = useSelector((state: ReduxState) => state.lang)

    return (
        <>
            <Stack.Screen options={{ title: lang ? 'Oi!' : 'Oops!' }} />
            <View style={{
                justifyContent: 'center', 
                alignItems: 'center', 
                width: '100%', 
                height: '100%'
            }}>
                <Text style={{fontWeight: 600, fontSize: 30}}>
                    {lang ? 'Denne skjermen finnes ikke' : 'This screen does not exist'}
                </Text>
            </View>
        </>
    )
}
