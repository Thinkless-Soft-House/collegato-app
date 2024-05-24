import React, { useContext, useEffect, useState } from 'react';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    DrawerContentComponentProps,
    DrawerContentScrollView,
    DrawerItem
} from '@react-navigation/drawer';
import { Avatar, Drawer, Title, Caption, Paragraph } from 'react-native-paper';
import { ref, update } from "firebase/database";

import { chatDatabase, chatListRecadosEndPoint, collegatoChatId } from '../../../../services/firebaseConfigs/firebaseConfig';
import { View, TouchableOpacity } from 'react-native';
import { AuthContext, ILoginData, IUserData } from '../../../../services/auth';
import { PermissaoEnum, getLabelPermissaoEnum } from '../../../../models/enums/permissaoEnum';
import { ROUTES } from '../../../config/routesNames';

import styles from "./styles";
import { UsuarioChat } from '../../../../models/DTOs/usuarioChat';
import { CommonActions } from '@react-navigation/native';
import { tratarIdEmpresaChat } from '../../../../helpers/chatHelpers';
import { Chat } from '../../../../models/DTOs/chat';

const DrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
    const { usuarioLogado, pessoaLogada, limparLogin } = useContext<ILoginData>(AuthContext);
    const routesNames: string[] = props.state.routeNames;

    useEffect(() => {
        // if(routesNames[props.state.index] == ROUTES.ouvidoriaMenu) {
        //     toggleMandarNotificacaoUsuarioOnlineOuvidoria(false);
        // }
        // else {
        //     toggleMandarNotificacaoUsuarioOnlineOuvidoria(true);
        // }

        // if(routesNames[props.state.index] == ROUTES.recadosMenu) {
        //     toggleMandarNotificacaoUsuarioOnlineRecados(false);
        // }
        // else {
        //     toggleMandarNotificacaoUsuarioOnlineRecados(true);
        // }
    }, [props.state.index]);

    function toggleMandarNotificacaoUsuarioOnlineOuvidoria(mandarNotificacao: boolean) {
        const usuarioLogadoId = usuarioLogado.id;

        let usuarioChat: UsuarioChat = {
            mandarNotificacao
        }

        const reference = ref(chatDatabase, `ouvidoria/usuarios/${usuarioLogadoId}`);
        update(reference, usuarioChat).then(() => console.log("Data updated"));
    }

    function toggleMandarNotificacaoUsuarioOnlineRecados(mandarNotificacao: boolean) {
        const usuarioLogadoId = usuarioLogado.id;

        let usuarioChat: UsuarioChat = {
            mandarNotificacao
        }

        const reference = ref(chatDatabase, `recados/usuarios/${usuarioLogadoId}`);
        update(reference, usuarioChat).then(() => console.log("Data updated"));
    }

    function showAdministracaoDrawerItem() {
        return (
            <>
                <Drawer.Item
                    label="Empresas"
                    active={routesNames[props.state.index] == ROUTES.empresasMenu}
                    onPress={() => onPressMenu(ROUTES.empresasMenu)}
                    icon={({ size, color }) => <IconMCI name="office-building" size={size} color={color} />}
                />
                <Drawer.Item
                    label="Partições"
                    active={routesNames[props.state.index] == ROUTES.salasMenu}
                    onPress={() => onPressMenu(ROUTES.salasMenu)}
                    icon={({ size, color }) => <IconMCI name="office-building-outline" size={size} color={color} />}
                />
                <Drawer.Item
                    label="Usuários"
                    active={routesNames[props.state.index] == ROUTES.usuariosMenu}
                    onPress={() => onPressMenu(ROUTES.usuariosMenu)}
                    icon={({ size, color }) => <IconMCI name="account-group" size={size} color={color} />}
                />
            </>
        );
    }

    function showEmpresaDrawerItem() {
        return (
            <>
                <Drawer.Item
                    label="Minha Empresa"
                    active={routesNames[props.state.index] == ROUTES.minhaEmpresa}
                    onPress={() => onPressMenu(ROUTES.minhaEmpresa)}
                    icon={({ size, color }) => <IconMCI name="office-building-outline" size={size} color={color} />}
                />
                <Drawer.Item
                    label="Partições da empresa"
                    active={routesNames[props.state.index] == ROUTES.salasMenu}
                    onPress={() => onPressMenu(ROUTES.salasMenu)}
                    icon={({ size, color }) => <IconMCI name="office-building-outline" size={size} color={color} />}
                />
                <Drawer.Item
                    label="Empregados"
                    active={routesNames[props.state.index] == ROUTES.usuariosMenu}
                    onPress={() => onPressMenu(ROUTES.usuariosMenu)}
                    icon={({ size, color }) => <IconMCI name="account-group" size={size} color={color} />}
                />
            </>
        )
    }

    function showEmpregadoDrawerItem() {
        return (
            <>
                <Drawer.Item
                    label="Partições da empresa"
                    active={routesNames[props.state.index] == ROUTES.salasMenu}
                    onPress={() => onPressMenu(ROUTES.salasMenu)}
                    icon={({ size, color }) => <IconMCI name="office-building-outline" size={size} color={color} />}
                />
            </>
        )
    }

    const LogOutUser: Function = (): void => {
        AsyncStorage.setItem('Token', '');
        limparLogin();
    };

    function onPressMenu(route: string) {
        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: route },
                ],
            })
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.drawerContent}>
                <View style={styles.userInfoSection}>
                    <TouchableOpacity onPress={() => onPressMenu(ROUTES.meuPerfil)}>
                        <View style={{ flexDirection: 'row', marginTop: 15 }}>
                            <Avatar.Image size={60} source={{ uri: `data:image/jpeg;base64,${pessoaLogada.foto}` }} />
                            <View style={{ marginLeft: 15, flexDirection: 'column' }}>
                                <Title style={styles.title}>{pessoaLogada?.nome}</Title>
                                <Caption style={styles.caption}>{getLabelPermissaoEnum(usuarioLogado.permissaoId)}</Caption>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.row}>
                        {usuarioLogado.empresa && (
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.caption]}>
                                    {usuarioLogado.empresa.nome}
                                </Paragraph>
                            </View>
                        )}
                    </View>
                </View>
                <DrawerContentScrollView {...props}>
                    <Drawer.Section style={styles.drawerSection}>
                        <Drawer.Item
                            label="Início"
                            active={routesNames[props.state.index] == ROUTES.homeMenu}
                            onPress={() => onPressMenu(ROUTES.homeMenu)}
                            icon={({ size, color }) => <IconMCI name="home" size={size} color={color} />}
                        />
                        {usuarioLogado.permissaoId == PermissaoEnum.Cliente && (
                            <Drawer.Item
                                label="Agendar"
                                active={routesNames[props.state.index] == ROUTES.agendamentoMenu}
                                onPress={() => onPressMenu(ROUTES.agendamentoMenu)}
                                icon={({ size, color }) => <IconMCI name="calendar-month" size={size} color={color} />}
                            />
                        )}
                        <Drawer.Item
                            label="Compromissos"
                            active={routesNames[props.state.index] == ROUTES.compromisso}
                            onPress={() => onPressMenu(ROUTES.compromisso)}
                            icon={({ size, color }) => <IconMCI name="calendar-outline" size={size} color={color} />}
                        />
                        {usuarioLogado.permissaoId != PermissaoEnum.Administrador && (
                            <Drawer.Item
                                label="Recados"
                                active={routesNames[props.state.index] == ROUTES.recadosMenu}
                                onPress={() => onPressMenu(ROUTES.recadosMenu)}
                                icon={({ size, color }) => <IconMCI name="chat-outline" size={size} color={color} />}
                            />
                        )}
                        <Drawer.Item
                            label="Ouvidoria"
                            active={routesNames[props.state.index] == ROUTES.ouvidoriaMenu}
                            onPress={() => onPressMenu(ROUTES.ouvidoriaMenu)}
                            icon={({ size, color }) => <IconMCI name="chat-question" size={size} color={color} />}
                        />
                    </Drawer.Section>

                    {usuarioLogado.permissaoId == PermissaoEnum.Administrador && (
                        <Drawer.Section title="Administração" style={styles.drawerSection}>
                            {showAdministracaoDrawerItem()}
                        </Drawer.Section>
                    )}

                    {usuarioLogado.permissaoId == PermissaoEnum.Empresario && (
                        <Drawer.Section title="Empresa" style={styles.drawerSection}>
                            {showEmpresaDrawerItem()}
                        </Drawer.Section>
                    )}

                    {usuarioLogado.permissaoId == PermissaoEnum.Funcionario && (
                        <Drawer.Section title="Empregado" style={styles.drawerSection}>
                            {showEmpregadoDrawerItem()}
                        </Drawer.Section>
                    )}
                </DrawerContentScrollView>
            </View>

            <Drawer.Section style={styles.bottomDrawerSection}>
                <Drawer.Item
                    label="Relatórios"
                    active={routesNames[props.state.index] == ROUTES.relatorio}
                    onPress={() => onPressMenu(ROUTES.relatorio)}
                    icon={({ size, color }) => <IconMCI name="file-chart-outline" size={size} color={color} />}
                />
                <Drawer.Item
                    label="Contato Collegato"
                    active={routesNames[props.state.index] == ROUTES.contato}
                    onPress={() => onPressMenu(ROUTES.contato)}
                    icon={({ size, color }) => <IconMCI name="forum" size={size} color={color} />}
                />
                <DrawerItem
                    label="Sair"
                    style={{paddingLeft: 10}}
                    onPress={() => LogOutUser()}
                    icon={(props) => <IconMCI name="exit-to-app" size={props.size} color={props.color} />}
                />
            </Drawer.Section>
        </View>
    );
}

export default DrawerContent;
