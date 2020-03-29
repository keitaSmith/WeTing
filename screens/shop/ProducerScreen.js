import React from 'react';
import {View,Text} from 'react-native';
import { WaveIndicator } from 'react-native-indicators';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';

const ProducerScreen = props =>{
    return (
        <LinearGradient colors={[Colors.gradeA, Colors.gradeB]} style={{ flex: 1 }}>
                <WaveIndicator color={Platform.OS === 'android' ? 'white' : Colors.primary} size={150} waveMode={"outline"} waveFactor={0.4} count={2} />
            </LinearGradient>
    )
};
export default ProducerScreen