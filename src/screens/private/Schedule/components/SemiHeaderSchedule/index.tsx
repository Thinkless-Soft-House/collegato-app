import { View, Text } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';

import styles from './styles';

const SemiHeaderSchedule: React.FC = () => (
    <View style={[styles.containSemiHeader]}>
        <Text style={[styles.montserrat, styles.colorDefault]}>
            Agendamento
        </Text>
        <Icon name="tasks" size={25} color="#4F7C8A" />
    </View>
);

export default SemiHeaderSchedule;
