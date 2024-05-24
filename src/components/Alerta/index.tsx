import React, { PropsWithChildren } from 'react';
import { View, Text, StyleProp, TextStyle } from 'react-native';

import styles from './styles';

interface AlertaProps extends PropsWithChildren {
    tipo: 'default' | 'success' | 'danger' | 'warning';
    style?: StyleProp<TextStyle>;
    textStyle?: StyleProp<TextStyle>;
}

const Alerta: React.FC<AlertaProps> = ({children, style, textStyle, tipo}) => {
    function tratarTipo() {
        switch (tipo) {
            case 'success':
                return styles.successNotificacao;
            case 'danger':
                return styles.dangerNotificacao;
            case 'warning':
                return styles.warningNotificacao;
            default:
                return styles.defaultNotificacao;
        }
    }

    return (
        <View style={[styles.notificacaoAlerta, tratarTipo(), style]}>
            <Text style={[styles.notificacaoAlertaText, textStyle]}>{children && children}</Text>
        </View>
    );
}

export default Alerta;
