import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useFocusEffect, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ref, onValue, remove, update, get } from "firebase/database";
import uuid from 'react-native-uuid';
import {
    View,
    FlatList,
    Text
} from 'react-native';
import { Avatar, Button, MD2Colors, IconButton } from 'react-native-paper';

import SemiHeader from '../../../components/SemiHeader';
import Card from '../../../components/Card';

import { fotoCollegato } from '../../../global/fotoCollegato';
import { chatDatabase, collegatoChatId, chatListOuvidoriasEndPoint, messagesOuvidoriasEndPoint, usuariosOuvidoriasEndPoint } from '../../../services/firebaseConfigs/firebaseConfig';
import { ROUTES } from '../../../routes/config/routesNames';
import { AuthContext, ILoginData } from '../../../services/auth';
import { Chat } from '../../../models/DTOs/chat';
import { PermissaoEnum } from '../../../models/enums/permissaoEnum';
import { tratarIdEmpresaChat } from '../../../helpers/chatHelpers';

import styles from './styles';

const Ombudsman: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { dataLoginUser, usuarioLogado, pessoaLogada } = useContext<ILoginData>(AuthContext);
    const screenIsFocused = useIsFocused();
    const route = useRoute();
    const [chatList, setChatList] = useState<Chat[]>([]);

    // useEffect(() => {
    //     getChatList();
    // }, []);

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
        let quemCriouOChatId = 0;

        switch (usuarioLogado.permissaoId) {
            case PermissaoEnum.Cliente:
                quemCriouOChatId = usuarioLogado.id;
                break;
            case PermissaoEnum.Administrador:
                quemCriouOChatId = collegatoChatId;
                break;
            default:
                quemCriouOChatId = tratarIdEmpresaChat(usuarioLogado.empresa.id);
                break;
        }

        const reference = ref(chatDatabase, `${chatListOuvidoriasEndPoint}/${quemCriouOChatId}`);
        onValue(reference, (snapshot) => {
            if (snapshot != null && snapshot.val() != null) {
                setChatList(Object.values(snapshot.val()));
            }
            else {
                setChatList([]);
            }
        });
    }

    function createChatList() {
        let quemCriouOChatId = 0;
        let quemCriouOChatNome = "";

        switch (usuarioLogado.permissaoId) {
            case PermissaoEnum.Cliente:
                quemCriouOChatId = usuarioLogado.id;
                quemCriouOChatNome = pessoaLogada.nome;
                break;
            case PermissaoEnum.Administrador:
                quemCriouOChatId = usuarioLogado.id;
                quemCriouOChatNome = pessoaLogada.nome;
                break;
            default:
                quemCriouOChatNome = usuarioLogado.empresa.nome;
                quemCriouOChatId = tratarIdEmpresaChat(usuarioLogado.empresa.id);
                break;
        }

        let quemRecebeuOChatFoto = fotoCollegato;
        let quemRecebeuOChatNome = "Collegato";
        let quemRecebeuOChatId = collegatoChatId;

        let endpointQuemRecebeuAReserva = `${chatListOuvidoriasEndPoint}/${quemRecebeuOChatId}/${quemCriouOChatId}`;
        let endpointQuemFezAReserva = `${chatListOuvidoriasEndPoint}/${quemCriouOChatId}/${quemRecebeuOChatId}`;

        const salaId = uuid.v4();
        let quemEstaLogadoFoto = getChatFotoDoUsuarioLogado();

        let dadosUsuarioLogado: Chat = {
            usuarioId: quemCriouOChatId,
            salaId: salaId,
            nome: quemCriouOChatNome,
            foto: quemEstaLogadoFoto,
            ultimaMensagem: "",
            viuUltimaMensagem: true,
        }

        const referenceChatListOne = ref(chatDatabase, endpointQuemRecebeuAReserva);
        update(referenceChatListOne, dadosUsuarioLogado).then(() => console.log("Data updated"));

        let usuarioData: Chat = {
            usuarioId: quemRecebeuOChatId,
            salaId: salaId,
            nome: quemRecebeuOChatNome,
            foto: quemRecebeuOChatFoto,
            ultimaMensagem: "",
            viuUltimaMensagem: true,
        }

        const referenceChatListTwo = ref(chatDatabase, endpointQuemFezAReserva);
        update(referenceChatListTwo, usuarioData).then(() => console.log("Data updated"));
    }

    function onPressChat(item: Chat) {
        const usuarioLogadoId = getChatIdDoUsuarioLogado();

        let chatListUpdate = {
            viuUltimaMensagem: true,
        }

        const referenceChatListOne = ref(chatDatabase, `${chatListOuvidoriasEndPoint}/${usuarioLogadoId}/${item.usuarioId}`);
        update(referenceChatListOne, chatListUpdate).then(() =>
            navigation.navigate(ROUTES.chatOuvirodira, item)
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
                quemEstaLogadoId = tratarIdEmpresaChat(usuarioLogado.empresa.id);
                break;
        }

        return quemEstaLogadoId;
    }

    function onPressClose(item: Chat) {
        const usuarioLogadoId = getChatIdDoUsuarioLogado();

        const referenceChatListOne = ref(chatDatabase, `${chatListOuvidoriasEndPoint}/${usuarioLogadoId}/${item.usuarioId}`);
        remove(referenceChatListOne).then(() =>
            console.log("referenceChatListOne Excluido")
        ).catch((error) => console.error(error));

        const referenceChatListTwo = ref(chatDatabase, `${chatListOuvidoriasEndPoint}/${item.usuarioId}/${usuarioLogadoId}`);
        remove(referenceChatListTwo).then(() =>
            console.log("referenceChatListTwo Excluido")
        ).catch((error) => console.error(error));

        const referenceMessagesOne = ref(chatDatabase, `${messagesOuvidoriasEndPoint}/${item.salaId}`);
        remove(referenceMessagesOne).then(() =>
            console.log("referenceMessagesOne Excluido")
        ).catch((error) => console.error(error));

        const referenceUsuariosOne = ref(chatDatabase, `${usuariosOuvidoriasEndPoint}/${item.usuarioId}`);
        remove(referenceUsuariosOne).then(() =>
            console.log("referenceUsuariosOne Excluido")
        ).catch((error) => console.error(error));

        const referenceUsuariosTwo = ref(chatDatabase, `${usuariosOuvidoriasEndPoint}/${usuarioLogadoId}`);
        remove(referenceUsuariosTwo).then(() =>
            console.log("referenceUsuariosTwo Excluido")
        ).catch((error) => console.error(error));
    }

    return (
        <View style={[styles.contain]}>
            <SemiHeader />

            {usuarioLogado.permissaoId != PermissaoEnum.Administrador && (chatList && chatList.length == 0) && (
                <Button mode="contained" onPress={() => createChatList()}>
                    Iniciar Ouvidoria
                </Button>
            )}

            <FlatList
                contentContainerStyle={styles.containerStyle}
                style={styles.itemsContainer}
                data={chatList}
                renderItem={({ item }) => (
                    <Card
                        title={item.nome}
                        cardStyle={styles.cardStyle}
                        contentStyle={styles.cardContentStyle}
                        leftStyle={styles.cardLeftStyle}
                        onPress={() => onPressChat(item)}
                        left={<Avatar.Image size={40} source={{ uri: `data:image/jpeg;base64,${item.foto}` }} />}
                        rightStyle={{ marginRight: 30 }}
                        right={
                            <>
                                {/*
                                <Button
                                    color={MD2Colors.red400}
                                    onPress={() => onPressClose(item)}>
                                    Fechar Ouvidoria
                                </Button> */}

                                <IconButton
                                    icon="close"
                                    iconColor={MD2Colors.red400}
                                    size={20}
                                    onPress={() => onPressClose(item)}
                                />
                            </>
                        }
                    >
                        {item.ultimaMensagem && (
                            <View style={styles.chatPreMessageContainer}>
                                {!item.viuUltimaMensagem && (
                                    <Avatar.Icon
                                        size={12}
                                        color={MD2Colors.green400}
                                        style={{ backgroundColor: MD2Colors.green400 }}
                                        icon="checkbox-blank-circle"
                                    />
                                )}

                                <Text style={styles.chatPreMessage}>
                                    {item.ultimaMensagem}
                                </Text>
                            </View>
                        )}
                    </Card>
                )}
            />
        </View>
    );
};

export default Ombudsman;
