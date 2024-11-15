import { View } from "react-native"
import { SvgXml } from "react-native-svg"
import Backside from '@assets/images/backside.svg'
import Card from "./card"

type CardsProps = {
    card: OneToFourteen
    randomType: CardType
}

export default function Cards({card, randomType}: CardsProps) {
    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 20,
        }}>
            <View style={{
                minWidth: 150,
                height: 250,
                maxHeight: 250,
                borderRadius: 10,
            }}>
                <SvgXml 
                    xml={Backside} 
                    style={{maxWidth: 150, maxHeight: 250}} 
                />
            </View>

            {card && <View style={{
                width: 150,
                height: 250,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Card
                    number={card} 
                    type={randomType}
                    style={{ 
                        height: 250, minHeight: 250, maxHeight: 250,
                        width: 150, minWidth: 150, maxWidth: 150 
                    }} 
                />
            </View>}
        </View>
    )
}
