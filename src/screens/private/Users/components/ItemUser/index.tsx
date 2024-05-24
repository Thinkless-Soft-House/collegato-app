import React, { useState } from 'react';
import IconE from 'react-native-vector-icons/Entypo'
import { View, TouchableOpacity } from 'react-native';
import { Avatar, MD2Colors, Menu, Divider, List } from 'react-native-paper';

import styles from './styles';
import Card from '../../../../../components/Card';

interface ItemUserProps {
    userName: string,
    userPermission: string,
    userImage: string;
    userEmail: string;
    userEmpresa: string;
    onPressEdit: () => void;
    onPressDelete: () => void;
}

export const ItemUser: React.FC<ItemUserProps> = (props) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    function onPressDelete() {
        closeMenu();
        props.onPressDelete();
    }

    function onPressEdit() {
        closeMenu();
        props.onPressEdit();
    }

    return (
        <>
            <Card
                mainContentStyle={{ marginBottom: 15 }}
                onPress={onPressEdit}
                title={props.userName}
                titleStyle={styles.cartTitleStyle}
                subtitle={props.userPermission}
                subtitleStyle={styles.cartTitleStyle}
                contentStyle={styles.cardContentStyle}
                leftStyle={styles.cardLeftStyle}
                left={<Avatar.Image size={60} source={{ uri: `data:image/jpeg;base64, ${props.userImage}` }} />}
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
                            title={props.userEmail}
                            titleNumberOfLines={4}
                            descriptionNumberOfLines={4}
                            description="E-mail"
                            left={props => <List.Icon {...props} style={{ width: 25 }} icon="email-check" />}
                        />
                        {props.userEmpresa && (
                            <List.Item
                                title={props.userEmpresa}
                                titleNumberOfLines={4}
                                descriptionNumberOfLines={4}
                                description="Empresa"
                                left={props => <List.Icon {...props} style={{ width: 25 }} icon="office-building-outline" />}
                            />
                        )}
                    </View>
                </>
            </Card>
        </>
    );
}
