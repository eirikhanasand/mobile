import { Text, TouchableOpacity, ImageBackground, View } from "react-native"
import { useSelector } from "react-redux"

type ButtonProps = {
    handler: () => void
    text: string
    backgroundImage?: any;      // Optional background image
}

export default function Button({handler, text, backgroundImage}: ButtonProps) {
    const { theme } = useSelector((state: ReduxState) => state.theme)

    return (
        <TouchableOpacity
            style={{
                borderRadius: 175,
                marginLeft: 30,
                marginVertical: 15,
                width: 350,
                height: 350, 
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.contrast,
                overflow: 'hidden',
            }} 
            onPress={handler}
        >
            {backgroundImage ? (
                <ImageBackground
                    source={backgroundImage}
                    style={{
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    imageStyle={{ borderRadius: 175 }} 
                    resizeMode="cover"
                >
                <View style={{
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background covering the whole circle
                    borderRadius: 175,
                }}>
                    <Text style={{
                        color: theme.textColor,
                        fontWeight: 'bold',
                        fontSize: 28,
                    }}>
                        {text}
                    </Text>
                </View>
            </ImageBackground>
            ) : (
            <Text style={{
                display: 'flex',
                flexWrap: 'nowrap',
                padding: 70,
                color: theme.textColor,
                fontWeight: 'bold',
                fontSize: 28
            }}>{text}</Text>
        )}
        </TouchableOpacity>
    )
}