import { Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

type ButtonProps = {
    handler: () => void;
    text: string;
};

export default function SmallButton({ handler, text }: ButtonProps) {
    const { theme } = useSelector((state: ReduxState) => state.theme);

    return (
        <TouchableOpacity
            style={{
                borderRadius: 75,
                marginLeft: 15,
                marginVertical: 10,
                width: 150,
                height: 150,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.contrast,
                overflow: 'hidden',
            }}
            onPress={handler}
        >
            <View style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 75,
            }}>
                <Text style={{
                    color: theme.textColor,
                    fontWeight: 'bold',
                    fontSize: 28,
                }}>
                    {text}
                </Text>
            </View>
        </TouchableOpacity>
    );
}