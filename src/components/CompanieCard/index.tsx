import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import IconE from 'react-native-vector-icons/Entypo'
import openMap from 'react-native-open-maps';

import { Avatar, MD2Colors, Menu, Divider, List } from 'react-native-paper';
import Card from '../Card'

import { Empresa } from '../../models/empresa';
import { adicionarMascara } from '../../helpers/formHelpers';

import styles from './styles';

interface CompanieCardProps {
    item: Empresa;
    onPressEdit: () => void;
    onPressDelete: () => void;
    onPressRooms: () => void;
}

export const CompanieCard: React.FC<CompanieCardProps> = (props) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    function onPressTelefone(telefone: string): void {
        Linking.openURL(`tel:${telefone}`)
    }

    function onPressEndereco(endereco: string): void {
        openMap({query: endereco});
    }

    function onPressDelete() {
        closeMenu();
        props.onPressDelete();
    }

    function onPressEdit() {
        closeMenu();
        props.onPressEdit();
    }

    function onPressRooms() {
        closeMenu();
        props.onPressRooms();
    }

    function getEnderecoCompleto(empresa: Empresa) {
        let empresaEndereco = `${empresa.endereco} - ${empresa.numeroEndereco} - ${empresa.municipio} - ${empresa.estado} - ${empresa.cep} - ${empresa.pais}`;
        return empresaEndereco;
    }

    function showDocument(documento: string) {
        if (!documento) {
            return '-';
        }

        if(documento.length == 11) {
            return adicionarMascara(documento, 'cpf');
        }

        return adicionarMascara(documento, 'cnpj');
    }

    return (
        <Card
            mainContentStyle={{ marginBottom: 15 }}
            // onPress={onPressEdit}
            title={props.item.nome}
            titleStyle={styles.cartTitleStyle}
            subtitle={props.item.categoriaNome}
            subtitleStyle={styles.cartTitleStyle}
            contentStyle={styles.cardContentStyle}
            leftStyle={styles.cardLeftStyle}
            left={<Avatar.Image size={60} source={{ uri: `data:image/jpeg;base64, ${props.item.logo}` }} />}
            right={(
                <View style={styles.buttonActionsContainer}>
                    <Menu
                        style={styles.menuBox}
                        visible={menuVisible}
                        onDismiss={closeMenu}
                        anchor={
                            <TouchableOpacity style={styles.buttonMenu} onPress={openMenu}>
                                <IconE name='dots-three-vertical' color={MD2Colors.grey700} size={20} />
                            </TouchableOpacity>
                        }>
                        <Menu.Item onPress={onPressRooms} leadingIcon="door-open" title="Salas" />
                        <Menu.Item onPress={onPressEdit} leadingIcon="pencil" title="Editar" />
                        <Divider />
                        <Menu.Item style={{ backgroundColor: MD2Colors.red100 }} onPress={onPressDelete} leadingIcon="delete-outline" title="Excluir" />
                    </Menu>
                </View>
            )}
        >
            <>
                <Divider />
                <View>
                    <List.Item
                        title={adicionarMascara(props.item.telefone, 'cel-phone')}
                        titleNumberOfLines={4}
                        descriptionNumberOfLines={4}
                        onPress={() => onPressTelefone(props.item.telefone)}
                        description="Telefone"
                        left={props => <List.Icon {...props} style={{ width: 25 }} icon="cellphone-check" />}
                    />
                    <List.Item
                        title={getEnderecoCompleto(props.item)}
                        titleNumberOfLines={4}
                        descriptionNumberOfLines={4}
                        onPress={() => onPressEndereco(getEnderecoCompleto(props.item))}
                        description="Endereço"
                        left={props => <List.Icon {...props} style={{ width: 25 }} icon="map-marker-multiple" />}
                    />
                    <List.Item
                        title={props.item.categoriaNome}
                        titleNumberOfLines={4}
                        descriptionNumberOfLines={4}
                        description="Categoria"
                        left={props => <List.Icon {...props} style={{ width: 25 }} icon="account-tie" />}
                    />
                    <List.Item
                        title={showDocument(props.item.cpfCnpj)}
                        titleNumberOfLines={4}
                        descriptionNumberOfLines={4}
                        description="CPF/CNPJ"
                        left={props => <List.Icon {...props} style={{ width: 25 }} icon="card-bulleted-outline" />}
                    />
                </View>
            </>
        </Card>
    );
};

;
