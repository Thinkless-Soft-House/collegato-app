import React, { useState } from 'react';
import IconE from 'react-native-vector-icons/Entypo'
import { TouchableOpacity, View } from 'react-native';
import { MD2Colors, Menu, Divider } from 'react-native-paper';

import styles from './styles';

interface MenuRoomProps {
    onPressEdit: () => void;
    onPressCompromissos: () => void;
    onPressDelete: () => void;
}

const MenuRoom: React.FC<MenuRoomProps> = (props) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    function onPressEdit() {
        closeMenu();
        props.onPressEdit();
    }

    function onPressCompromissos() {
        closeMenu();
        props.onPressCompromissos();
    }

    function onPressDelete() {
        closeMenu();
        props.onPressDelete();
    }

    return (
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
                <Menu.Item onPress={onPressCompromissos} leadingIcon="calendar-multiple" title="Compromissos" />
                <Menu.Item onPress={onPressEdit} leadingIcon="pencil" title="Editar" />
                <Divider />
                <Menu.Item style={{ backgroundColor: MD2Colors.red100 }} onPress={onPressDelete} leadingIcon="delete-outline" title="Excluir" />
            </Menu>
        </View>
    );
}

export default MenuRoom;
