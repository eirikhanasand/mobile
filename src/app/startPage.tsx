import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

export default function StartScreen() {
    return (
        <ImageBackground
            source={require('../../public/assets/images/bubblesPic.png')}
            style={styles.backgroundImage}
        />
        
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});