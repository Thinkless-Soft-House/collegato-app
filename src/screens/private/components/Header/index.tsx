import React from 'react';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerHeaderProps, DrawerNavigationProp } from '@react-navigation/drawer';
import { globalColors } from '../../../../global/styleGlobal';

import LogoTop from '../../../../../assets/TopLogo.jpeg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrivateStackParams } from '../../../../routes/private';
import styles from './styles';

const Header: React.FC<DrawerHeaderProps> = (props) => {
    const navigation =
    useNavigation<DrawerNavigationProp<PrivateStackParams>>();

    return (
        <View style={[styles.contain]}>
            <TouchableOpacity style={styles.bntHeader} onPress={() => navigation.openDrawer()}>
                 <IconMCI name={"menu"} size={40} color={globalColors.primaryColor} />
            </TouchableOpacity>

            <Text style={styles.headerName}>{props.route.name}</Text>

            <Image source={LogoTop} style={[styles.imgLogo]} />
        </View>
    )
};

export default Header;
