import { View, Image } from 'react-native';
import React from 'react';

import LogoTop from '../../../../../assets/TopLogo.jpeg';
import styles from './styles';

const Header = () => (
    <View style={[styles.contain]}>
        <Image source={LogoTop} style={[styles.imgLogo]} />
    </View>
);

export default Header;
