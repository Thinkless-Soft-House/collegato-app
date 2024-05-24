import React from 'react';
import { Text } from 'react-native';
import { Snackbar } from 'react-native-paper';

import styles from './styles';

export type NotificaoTipo = 'default' | 'success' | 'danger' | 'warning';

export interface NotificacaoConfig {
    notificacao: string;
    tipo?: NotificaoTipo;
}

interface NotificacaoProps {
    config: NotificacaoConfig;
    visivel: boolean;
    onDismiss: () => void;
    onPress: () => void;
}

export const Notificacao: React.FC<NotificacaoProps> = (props) => {

    function tratarTipo() {
        switch (props.config.tipo) {
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
        <Snackbar
            visible={props.visivel}
            onDismiss={props.onDismiss}
            wrapperStyle={styles.notificacao}
            style={[tratarTipo()]}
            duration={5000}
            action={{
                label: 'Fechar',
                labelStyle: styles.notificacaoBtn,
                onPress: props.onPress,
            }}>
                <Text style={{fontWeight: 'bold'}}>
                    {props.config.notificacao}
                </Text>
        </Snackbar>
    );
}
