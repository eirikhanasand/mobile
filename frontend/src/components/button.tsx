import { Text, TouchableOpacity, ImageBackground, View } from "react-native"
import { useSelector } from "react-redux"

type ButtonProps = {
    handler: () => void
    text: string
    backgroundImage?: any
}

export default function Button({handler, text, backgroundImage}: ButtonProps) {
    const { theme } = useSelector((state: ReduxState) => state.theme)

    return (
        <TouchableOpacity
            style={{
                borderRadius: 175,
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
                    backgroundColor: theme.imageOverlay,
                    borderRadius: 175,
                }}>
                    <View style={{
                            padding: 10,
                            backgroundColor:theme.contrast, 
                            borderRadius: 10,
                        }}>
                        <Text style={{
                            color: theme.textColor,
                            fontWeight: 'bold',
                            fontSize: 28,
                        }}>
                            {text}
                        </Text>
                    </View>
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
