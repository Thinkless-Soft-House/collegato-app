import { View, Text } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Fontisto';

import styles from './styles';

const SemiHeaderChat: React.FC = () => (
    <View style={[styles.containSemiHeader]}>
        <Text style={[styles.montserrat, styles.colorDefault]}>Conversas</Text>
        <Icon name="hipchat" size={25} color="#4F7C8A" />
    </View>
);

export default SemiHeaderChat;
