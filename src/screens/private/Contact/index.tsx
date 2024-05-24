import { View, Alert, TouchableOpacity, Modal, Linking } from 'react-native';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';
import { Avatar, Button, Divider, IconButton, List, Subheading, Text, TextInput } from 'react-native-paper';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import SemiHeader from '../../../components/SemiHeader';

import styles from './styles';
import { ROUTES } from '../../../routes/config/routesNames';
import { globalColors } from '../../../global/styleGlobal';

const Contact: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    function onPressBack() {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: ROUTES.homeMenu },
                ],
            })
        );
    }

    function onPressTelefone(telefone: string): void {
        Linking.openURL(`tel:${telefone}`)
    }

    return (
        <>
            <SemiHeader goBack={onPressBack} titulo='Entre em contato' />
            <View style={[styles.contain]}>
                {/* <Text variant="headlineMedium" style={styles.title}>Entre em contato:</Text> */}
                <TextInput
                    label="Contato"
                    mode='outlined'
                    editable={false}
                    style={styles.input}
                    outlineColor={globalColors.primaryColor}
                    value="(31) 3254-9900"
                    right={<TextInput.Icon icon="phone" onPress={() => Linking.openURL("tel:(31) 3254-9900")}/>}
                />

                <TextInput
                    label="E-mail de suporte"
                    mode='outlined'
                    editable={false}
                    style={styles.input}
                    outlineColor={globalColors.primaryColor}
                    value="contato@dynamopc.com.br"
                    right={<TextInput.Icon icon="email" onPress={() => Linking.openURL('mailto:contato@dynamopc.com.br') } />}
                />

                <TextInput
                    label="Site"
                    mode='outlined'
                    editable={false}
                    style={styles.input}
                    outlineColor={globalColors.primaryColor}
                    value="www.collegato.com.br"
                    right={<TextInput.Icon icon="web" onPress={() => Linking.openURL('https://www.collegato.com.br') } />}
                />
            </View>
        </>
    )
}

export default Contact;