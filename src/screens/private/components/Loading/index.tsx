import { Text } from 'react-native';
import React from 'react';
// import * as Progress from 'react-native-progress';
import Progress from 'react-native-progress/Circle';
import { MotiView } from 'moti';

import styles from './styles';

const Loading = () => (
    <MotiView
        style={[styles.containProgressBar]}
        from={{
            opacity: 0,
            marginVertical: 0,
        }}
        animate={{
            opacity: 1,
            marginVertical: 20,
        }}
    >
        <Text style={[styles.montserrat, styles.textLoading]}>
            Carregando...
        </Text>
        <Progress
            color="#52c7e2"
            borderWidth={3}
            size={40}
            indeterminate
            style={{ alignSelf: 'center' }}
        />
    </MotiView>
);

export default Loading;
