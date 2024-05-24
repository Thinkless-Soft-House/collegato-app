import { useFocusEffect, useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Dimensions,
} from 'react-native';
import uuid from 'react-native-uuid';
import { ref, onValue, push, update, DataSnapshot, onChildAdded, off } from "firebase/database";

import { chatDatabase, collegatoChatId, chatListOuvidoriasEndPoint, messagesOuvidoriasEndPoint, usuariosOuvidoriasEndPoint } from '../../../../../services/firebaseConfigs/firebaseConfig';
import { Avatar, IconButton, Title } from 'react-native-paper';
import SemiHeader from '../../../../../components/SemiHeader';
import Input from '../../../../../components/Input';

import { getDataAtualFormatada } from '../../../../../helpers/dataHelpers';
import styles from './styles';
import { globalColors } from '../../../../../global/styleGlobal';
import { Chat } from '../../../../../models/DTOs/chat';
import { ChatMessage } from '../../../../../models/DTOs/chatMessage';
import { AuthContext, ILoginData } from '../../../../../services/auth';
import { ROUTES } from '../../../../../routes/config/routesNames';
import { UsuarioChat } from '../../../../../models/DTOs/usuarioChat';
import { PermissaoEnum } from '../../../../../models/enums/permissaoEnum';
import { tratarIdEmpresaChat } from '../../../../../helpers/chatHelpers';


interface IChatData {
    message: string;
    you: boolean;
    name: string;
    time: string;
}

const { width } = Dimensions.get('window');

interface ChatOmbudsmanParams extends Chat {
}

const chatListEndPoint = "ouvidoria";

const ChatOmbudsman: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { dataLoginUser, usuarioLogado, pessoaLogada } = useContext<ILoginData>(AuthContext);
    const route = useRoute();
    const screenIsFocused = useIsFocused();

    const [params, setParams] = useState<ChatOmbudsmanParams>({} as ChatOmbudsmanParams);
    const [message, setMessage] = useState<string>();
    const [allChat, setAllChat] = useState<ChatMessage[]>([]);
    const [loadingModal, setLoadingModal] = useState<boolean>(true);
    const refMessages = useRef<any>(null);
    const [newMessage, setNewMessage] = useState<string>("");
    const [chatConfig, setChatConfig] = useState<Chat>();
    const [usuarioConfig, setUsuarioConfig] = useState<UsuarioChat>();
    const [sendButtonDisable, setSendButtonDisable] = useState<boolean>(false);

    // QUANDO A TELA ESTIVER EM FOCO (INICIADA)
    useFocusEffect(
        useCallback(() => {
            buscarDadosIniciais();
        }, [screenIsFocused])
    );

    useEffect(() => {
        return () => {
        }
    });

    useEffect(() => {
        if(params) {
            buscarDadosUsuarioDestino();
            getAllChat();
        }
    }, [params]);

    function buscarDadosIniciais() {
        if (route.params) {
            let _params = route.params as ChatOmbudsmanParams;
            setParams(_params);
        }
    }

    function buscarDadosUsuarioDestino() {
        const usuarioLogadoId = getChatIdDoUsuarioLogado();

        const referenceChatList = ref(chatDatabase, `${chatListOuvidoriasEndPoint}/${usuarioLogadoId}/${params.usuarioId}`);
        onValue(referenceChatList, (snapshot) => {
            tratarObjetoChatConfig(snapshot);
        });

        const referenceUsuarios = ref(chatDatabase, `${usuariosOuvidoriasEndPoint}/${params.usuarioId}`);
        onValue(referenceUsuarios, (snapshot) => {
            tratarObjetoUsuarioChat(snapshot);
        });
    }

    function tratarObjetoChatConfig(snapshot: DataSnapshot) {
        if (snapshot != null && snapshot.val() != null) {
            let objeto: any[] = Object.values(snapshot.val());
            if(objeto.length > 0) {
                setChatConfig(objeto[0]);
            }
        }
        else {
            setChatConfig({} as Chat);
        }
    }

    function tratarObjetoUsuarioChat(snapshot: DataSnapshot) {
        if (snapshot != null && snapshot.val() != null) {
            let objeto: any[] = Object.values(snapshot.val());
            if(objeto.length > 0) {
                setUsuarioConfig(objeto[0]);
            }
        }
        else {
            setUsuarioConfig({} as UsuarioChat);
        }
    }

    function sendMessage(): void {
        if(!newMessage || /^ *$/.test(newMessage))
            return;

        setSendButtonDisable(true);
        const usuarioLogadoId = getChatIdDoUsuarioLogado();

        let mensagemData: ChatMessage = {
            id: uuid.v4(),
            salaId: params.salaId,
            from: usuarioLogadoId,
            to: params.usuarioId,
            mensagem: newMessage,
            tipoMensagem: 'text',
            data: getDataAtualFormatada(),
        }
        const referenceChatListOne = ref(chatDatabase, `${messagesOuvidoriasEndPoint}/${params.salaId}`);
        push(referenceChatListOne, mensagemData).then(() => {
            // Notificar o usuário destino que ele recebeu uma mensagem.
            // Caso o mesmo não esteja no chat.
            let chatListUpdate = {
                ultimaMensagem: newMessage,
                viuUltimaMensagem: false,
            }

            if(usuarioConfig && !usuarioConfig.mandarNotificacao) {
                console.log("Vou enviar uma notificação para o usuário de destinoo.");
            }
            else {
                chatListUpdate.viuUltimaMensagem = true;
            }

            const referenceChatListOne = ref(chatDatabase, `${chatListOuvidoriasEndPoint}/${params.usuarioId}/${usuarioLogadoId}`);
            update(referenceChatListOne, chatListUpdate).then(() => console.log("Data updated"));

            chatListUpdate.viuUltimaMensagem = true;
            const referenceChatListTwo = ref(chatDatabase, `${chatListOuvidoriasEndPoint}/${usuarioLogadoId}/${params.usuarioId}`);
            update(referenceChatListTwo, chatListUpdate).then(() => console.log("Data updated"));
            setNewMessage("");
        });

        setSendButtonDisable(false);
    };

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

    function getAllChat() {
        const referenceChatListOne = ref(chatDatabase, `${chatListEndPoint}/messages/${params.salaId}`);
        const _onChildAdded = onChildAdded(referenceChatListOne, (snapshot) => {
            if (snapshot != null && snapshot.val() != null) {
                let newMessage:ChatMessage = snapshot.val() as ChatMessage;
                setAllChat(oldChat => [newMessage, ...oldChat]);
             }
        });

        return () => off(referenceChatListOne, "child_added", _onChildAdded);
    }

    // function chatOrdenado() {
    //     return allChat.sort((a,b) => {
    //         return getDataFromStringData(b.data) < getDataFromStringData(a.data) ? -1
    //         : getDataFromStringData(b.data) > getDataFromStringData(a.data) ? 1 : 0
    //     })
    // }

    function voltarTela() {
        navigation.reset({
            index: 0,
            routes: [{ name: ROUTES.ouvidoria }],
          });
    }

    function usuarioLogadoMandouMensagem(item: ChatMessage): boolean {
        const usuarioLogadoId = getChatIdDoUsuarioLogado();
        return item.from == usuarioLogadoId;
    }

    return (
        <View style={styles.contain}>
            <SemiHeader goBack={voltarTela}>
                <View style={styles.semiheaderContainer}>
                    <Avatar.Image size={40} source={{uri: `data:image/jpeg;base64,${params.foto}`}} />
                    {/* <Avatar.Image size={40} source={{uri: `data:image/jpeg;base64,${params.foto}`}} /> */}
                    <Title style={{marginLeft: 10}}>{params.nome}</Title>
                </View>
            </SemiHeader>

            <FlatList
                inverted
                style={styles.itemsContainer}
                data={allChat}
                renderItem={({ item }) => {
                    if (usuarioLogadoMandouMensagem(item)) {
                        return (
                            <View style={styles.messageSentContainer}>
                                <View style={[styles.messageContainer, styles.messageSent]}>
                                    <Text style={styles.messageTextSent} >{item.mensagem}</Text>
                                </View>
                                <Text style={styles.textLabel}>{item.data}</Text>
                            </View>
                        )
                    } else {
                        return (
                            <View style={styles.messageReceivedContainer}>
                                <View style={[styles.messageContainer, styles.messageReceived]}>
                                    <Text style={styles.messageTextReceived} >{item.mensagem}</Text>
                                </View>
                                <Text style={styles.textLabel}>{item.data}</Text>
                            </View>
                        )
                    }
                }}
            />

            <View style={styles.inputContainer}>
                <Input
                    containerStyle={styles.input}
                    placeholder="Digite uma mensagem"
                    editable
                    multiline
                    numberOfLines={3}
                    value={newMessage}
                    onChange={text => setNewMessage(text)}
                />

                <IconButton
                    icon="send-outline"
                    style={styles.inputButton}
                    iconColor={globalColors.primaryColor}
                    disabled={sendButtonDisable}
                    size={30}
                    onPress={() => sendMessage()}
                />
            </View>
        </View>
    );
}

export default ChatOmbudsman;
