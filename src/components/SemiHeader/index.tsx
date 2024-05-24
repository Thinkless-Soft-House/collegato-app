import { View, Text } from 'react-native';
import React, { PropsWithChildren } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IconButton } from 'react-native-paper';
import { globalColors } from '../../global/styleGlobal';
import { ROUTES } from '../../routes/config/routesNames';

import styles from './styles';

interface SemiHeaderProps extends PropsWithChildren {
    titulo?: string;
    goBack?: () => void;
    typeGoBack?: 'back' | 'backinit';
}

const SemiHeader: React.FC<SemiHeaderProps> = (props) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    function goBack() {
        if(props.goBack) {
            props.goBack();
            return;
        }

        if(props.typeGoBack == 'backinit')
            navigation.popToTop();
        else
            navigation.goBack();
    }

    return (
        <View style={[styles.containSemiHeader]}>
            <IconButton
                icon="arrow-left-bold"
                iconColor={globalColors.primaryColor}
                size={30}
                onPress={goBack}
            />

            {props.children ? (
                props.children
            )
                :
                props.titulo && (
                    <Text style={styles.titulo}>
                        {props.titulo}
                    </Text>
                )
            }
        </View>
    )
};

export default SemiHeader;
