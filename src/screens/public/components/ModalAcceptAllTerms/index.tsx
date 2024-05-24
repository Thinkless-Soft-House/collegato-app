import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from './styles';

interface IProps {
    lock: Function;
}

const ModalAcceptAllTerms: React.FC<IProps> = ({ lock }) => (
    <View style={[styles.contain]}>
        <View style={[styles.containContent]}>
            <View style={[styles.containText]}>
                <Text
                    style={[
                        styles.montserrat,
                        styles.title,
                        styles.colorDefault,
                        styles.text,
                    ]}
                >
                    Antes de continuar
                </Text>
            </View>

            <View style={[styles.containText]}>
                <Text
                    style={[
                        styles.montserrat,
                        styles.colorDefault,
                        styles.text,
                    ]}
                >
                    É necessario que você aceite todos os nosssos termos de
                    serviço para utilizar todos as facilidades oferecidas pelo
                    nosso aplicativo e suas funcionalidades.
                </Text>
            </View>

            <View style={[styles.containBtn]}>
                <TouchableOpacity
                    onPress={() => {
                        AsyncStorage.setItem('AceptAllTerms', 'false');
                        lock(false);
                    }}
                >
                    <Text
                        style={[
                            styles.montserrat,
                            styles.colorWhite,
                            styles.textBtn,
                            styles.text,
                        ]}
                    >
                        Aceitar
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
);

export default ModalAcceptAllTerms;
