import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useFocusEffect, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ref, onValue, update } from "firebase/database";
import {
    View,
    FlatList,
} from 'react-native';
import { Avatar, MD2Colors } from 'react-native-paper';

import SemiHeader from '../../../components/SemiHeader';
import Card from '../../../components/Card';

import { fotoCollegato } from '../../../global/fotoCollegato';
import { chatDatabase, chatListRecadosEndPoint, collegatoChatId } from '../../../services/firebaseConfigs/firebaseConfig';
import { ROUTES } from '../../../routes/config/routesNames';
import { AuthContext, ILoginData } from '../../../services/auth';
import { Chat } from '../../../models/DTOs/chat';
import { PermissaoEnum } from '../../../models/enums/permissaoEnum';

import styles from './styles';
import { tratarIdEmpresaChat } from '../../../helpers/chatHelpers';

const Message: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { dataLoginUser, usuarioLogado, pessoaLogada } = useContext<ILoginData>(AuthContext);
    const screenIsFocused = useIsFocused();
    const route = useRoute();
    const [chatList, setChatList] = useState<Chat[]>([]);

    // Quando a tela é focada.
    useFocusEffect(
        useCallback(() => {
            getChatList();
        }, [])
    );

    useEffect(() => {
        if (!screenIsFocused) {
            // Quando estiver saindo da tela
        }
    }, [screenIsFocused]);

    function getChatList() {
        let quemEstaLogadoId = 0;

        switch (usuarioLogado.permissaoId) {
            case PermissaoEnum.Cliente:
                quemEstaLogadoId = usuarioLogado.id;
                break;
            case PermissaoEnum.Administrador:
                quemEstaLogadoId = collegatoChatId;
                break;
            default:
                quemEstaLogadoId = tratarIdEmpresaChat(usuarioLogado.empresa.id);
                break;
        }

        const reference = ref(chatDatabase, `${chatListRecadosEndPoint}/${quemEstaLogadoId}`);
        onValue(reference, (snapshot) => {
            if (snapshot != null && snapshot.val() != null) {
                setChatList(Object.values(snapshot.val()));
            }
            else {
                setChatList([]);
            }
        });
    }

    function onPressChat(item: Chat) {
        let quemEstaLogadoId = getChatIdDoUsuarioLogado();
        let endpointCompleto = `${chatListRecadosEndPoint}/${quemEstaLogadoId}/${item.usuarioId}`;

        let chatListUpdate = {
            viuUltimaMensagem: true,
        }

        const referenceChatListOne = ref(chatDatabase, `${endpointCompleto}`);
        update(referenceChatListOne, chatListUpdate).then(() =>
            navigation.navigate(ROUTES.chatRecados, item)
        );
    }

    function getChatFotoDoUsuarioLogado(): string {
        let quemEstaLogadoFoto = "";

        switch (usuarioLogado.permissaoId) {
            case PermissaoEnum.Cliente:
                quemEstaLogadoFoto = pessoaLogada.foto;
                break;
            case PermissaoEnum.Administrador:
                quemEstaLogadoFoto = fotoCollegato;
                break;
            default:
                quemEstaLogadoFoto = usuarioLogado.empresa.logo;
                break;
        }

        return quemEstaLogadoFoto;
    }

    function getChatIdDoUsuarioLogado(): number {
        let quemEstaLogadoId = 0;

        switch (usuarioLogado.permissaoId) {
            case PermissaoEnum.Cliente:
                quemEstaLogadoId = usuarioLogado.id;
                break;
            case PermissaoEnum.Administrador:
                quemEstaLogadoId = collegatoChatId;
                break;
            default:
                quemEstaLogadoId = usuarioLogado.empresa.id;
                break;
        }

        return quemEstaLogadoId;
    }

    return (
        <View style={[styles.contain]}>
            <SemiHeader />
            {/* <Button mode="contained" onPress={() => createChatList(120, "fulano", "fulano@gmail.com")}>
                Criar Chat Teste
            </Button> */}
            <FlatList
                contentContainerStyle={styles.containerStyle}
                style={styles.itemsContainer}
                data={chatList}
                renderItem={({ item }) => (
                    <Card
                        title={item.nome}
                        subtitle={item.ultimaMensagem}
                        cardStyle={styles.cardStyle}
                        contentStyle={styles.cardContentStyle}
                        leftStyle={styles.cardLeftStyle}
                        onPress={() => onPressChat(item)}
                        left={<Avatar.Image size={40} source={{ uri: `data:image/jpeg;base64,${item.foto}` }} />}
                        rightStyle={{ marginRight: 30 }}
                        right={
                            <>
                                {!item.viuUltimaMensagem && (
                                    <Avatar.Icon
                                        size={12}
                                        color={MD2Colors.green400}
                                        style={{ backgroundColor: MD2Colors.green400 }}
                                        icon="checkbox-blank-circle"
                                    />
                                )}
                            </>
                        }
                    />
                )}
            />
        </View>
    );
};

export default Message;
