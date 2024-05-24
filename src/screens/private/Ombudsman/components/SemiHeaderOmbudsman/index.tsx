import { View, Text } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import styles from './styles';

const SemiHeader: React.FC = () => (
    <View style={[styles.containSemiHeader]}>
        <Text style={[styles.montserrat, styles.colorDefault]}>Ouvidoria</Text>
        <Icon name="account-tie-voice-outline" size={25} color="#4F7C8A" />
    </View>
);

export default SemiHeader;
