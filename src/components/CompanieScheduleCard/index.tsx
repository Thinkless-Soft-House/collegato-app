import React from 'react';
import { View, Text } from 'react-native';

import {
    Button,
    Avatar,
    Divider,
} from 'react-native-paper';
import Card from '../Card'

import styles from './styles';

interface CompanieCardProps {
    nome: string,
    categoria: string,
    logo: string;
    cnpj: string;
    telefone: string;
    pais: string;
    onPressRooms: () => void;
}

export const CompanieScheduleCard: React.FC<CompanieCardProps> = (props) => {
    function onPressRooms() {
        props.onPressRooms();
    }

    return (
        <>
            <Card
                mainContentStyle={{marginBottom: 15}}
                title={props.nome}
                subtitle={props.categoria}
                // onPress={props.onPressRooms}
                left={(<Avatar.Image size={50} source={{ uri: `data:image/jpeg;base64,${props.logo}` }} />)}
                right={(
                    <Button
                        style={styles.buttonActionsContainer}
                        mode="contained"
                        onPress={onPressRooms}
                    >
                        Agendar
                    </Button>
                )}
            >
                <>
                    <Divider />
                    <View style={styles.cardContentContainer}>
                        <View style={styles.cardContentItem}>
                            <Text style={styles.cardTextHead}>País</Text>
                            <Text style={styles.cardTextValue}>{props.pais}</Text>
                        </View>
                        <View style={styles.cardContentItem}>
                            <Text style={styles.cardTextHead}>CNPJ</Text>
                            <Text style={styles.cardTextValue}>{props.cnpj}</Text>
                        </View>
                        <View style={styles.cardContentItem}>
                            <Text style={styles.cardTextHead}>Telefone</Text>
                            <Text style={styles.cardTextValue}>{props.telefone}</Text>
                        </View>
                    </View>
                </>
            </Card>
        </>

    );
};

;
