import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import React from 'react';
import IconFA from 'react-native-vector-icons/FontAwesome5';
import IconO from 'react-native-vector-icons/Octicons';
import IconAD from 'react-native-vector-icons/AntDesign';
import IconE from 'react-native-vector-icons/Entypo';
import IconEI from 'react-native-vector-icons/EvilIcons';
import IconF from 'react-native-vector-icons/Feather';
import IconFa from 'react-native-vector-icons/FontAwesome';
import IconFI from 'react-native-vector-icons/Fontisto';
import IconI from 'react-native-vector-icons/Ionicons';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMI from 'react-native-vector-icons/MaterialIcons';
import IconSLI from 'react-native-vector-icons/SimpleLineIcons';
import IconZ from 'react-native-vector-icons/Zocial';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { fotoCollegato } from '../../../../../global/fotoCollegato';
import icone1 from '../../../../../../assets/icone1.jpeg';
import icone2 from '../../../../../../assets/icone2.jpeg';
import icone3 from '../../../../../../assets/icone3.jpeg';
import icone4 from '../../../../../../assets/icone4.jpeg';
import icone5 from '../../../../../../assets/icone5.jpeg';

import { PrivateStackParams } from '../../../../../routes/private';
import styles from './styles';
import { Avatar } from 'react-native-paper';
import { ROUTES } from '../../../../../routes/config/routesNames';
import { CategoriasEnum } from '../../../../../models/enums/categoriasEnum';

export interface IIcons {
    type: string;
    name: string;
    description: string;
    id?: number;
}

const iconsName: IIcons[] = [
    {
        type: 'fontAwesome5',
        name: 'user-md',
        description: 'Médicos',
    },
    {
        type: 'fontAwesome5',
        name: 'tooth',
        description: 'Dentistas',
    },
    {
        type: 'octicons',
        name: 'law',
        description: 'Advogados',
    },
    {
        type: 'fontAwesome5',
        name: 'users',
        description: 'Pessoal',
    },
];

interface IIconPerson {
    item: IIcons;
}

export const AllIcons: Function = (item: IIconPerson & IIcons) => (
    <View>
        {(item?.type === 'fontAwesome5' ||
            item.item?.type === 'fontAwesome5') && (
                <IconFA
                    name={item?.name || item.item?.name}
                    size={30}
                    color="#4F7C8A"
                />
            )}

        {(item?.type === 'octicons' || item.item?.type === 'octicons') && (
            <IconO
                name={item?.name || item.item?.name}
                size={30}
                color="#4F7C8A"
            />
        )}

        {(item?.type === 'antDesign' || item.item?.type === 'antDesign') && (
            <IconAD
                name={item?.name || item.item?.name}
                size={30}
                color="#4F7C8A"
            />
        )}

        {(item?.type === 'entypo' || item.item?.type === 'entypo') && (
            <IconE
                name={item?.name || item.item?.name}
                size={30}
                color="#4F7C8A"
            />
        )}

        {(item?.type === 'evilIcons' || item.item?.type === 'evilIcons') && (
            <IconEI
                name={item?.name || item.item?.name}
                size={30}
                color="#4F7C8A"
            />
        )}

        {(item.item?.type === 'feather' || item?.type === 'feather') && (
            <IconF
                name={item?.name || item.item?.name}
                size={30}
                color="#4F7C8A"
            />
        )}

        {(item.item?.type === 'fontAwesome' ||
            item?.type === 'fontAwesome') && (
                <IconFa
                    name={item.item?.name || item?.name}
                    size={30}
                    color="#4F7C8A"
                />
            )}

        {(item?.type === 'fontIsto' || item.item?.type === 'fontIsto') && (
            <IconFI
                name={item?.name || item.item?.name}
                size={30}
                color="#4F7C8A"
            />
        )}

        {(item?.type === 'ionicons' || item.item?.type === 'ionicons') && (
            <IconI
                name={item?.name || item.item?.name}
                size={30}
                color="#4F7C8A"
            />
        )}

        {(item?.type === 'materialCommunityIcons' ||
            item.item?.type === 'materialCommunityIcons') && (
                <IconMCI
                    name={item?.name || item.item?.name}
                    size={30}
                    color="#4F7C8A"
                />
            )}

        {(item?.type === 'materialIcons' ||
            item.item?.type === 'materialIcons') && (
                <IconMI
                    name={item?.name || item.item?.name}
                    size={30}
                    color="#4F7C8A"
                />
            )}

        {(item?.type === 'simpleLineIcons' ||
            item.item?.type === 'simpleLineIcons') && (
                <IconSLI
                    name={item?.name || item.item?.name}
                    size={30}
                    color="#4F7C8A"
                />
            )}

        {(item?.type === 'zocial' || item.item?.type === 'zocial') && (
            <IconZ
                name={item?.name || item.item?.name}
                size={30}
                color="#4F7C8A"
            />
        )}
    </View>
);

interface IDataAvatar {
    iconePhoto: ImageData;
    id?: number;
}

interface IProps {
    label: boolean;
}

const IconsCategory: React.FC<IProps> = (label) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
                style={[styles.containCategoryIcon]}
                onPress={() => navigation.navigate(ROUTES.agendamentoMenu, {
                    screen: ROUTES.agendamento,
                    params: { categoriaId: CategoriasEnum.Advogado }
                })}
            >
                <Avatar.Image
                    size={60}
                    style={[styles.avatarContain]}
                    source={icone2}
                />

                <Text
                    style={[styles.montserrat, styles.textDescription]}
                >
                    Advogados
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.containCategoryIcon]}
                onPress={() => navigation.navigate(ROUTES.agendamentoMenu, {
                    screen: ROUTES.agendamento,
                    params: { categoriaId: CategoriasEnum.Coworking }
                })}
            >
                <Avatar.Image
                    size={60}
                    style={[styles.avatarContain]}
                    source={icone5}
                />

                <Text
                    style={[styles.montserrat, styles.textDescription]}
                >
                    Coworking
                </Text>
            </TouchableOpacity>


            <TouchableOpacity
                style={[styles.containCategoryIcon]}
                onPress={() => navigation.navigate(ROUTES.agendamentoMenu, {
                    screen: ROUTES.agendamento,
                    params: { categoriaId: CategoriasEnum.Dentista }
                })}
            >
                <Avatar.Image
                    size={60}
                    style={[styles.avatarContain]}
                    source={icone4}
                />

                <Text
                    style={[styles.montserrat, styles.textDescription]}
                >
                    Dentistas
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.containCategoryIcon]}
                onPress={() => navigation.navigate(ROUTES.agendamentoMenu, {
                    screen: ROUTES.agendamento,
                    params: { categoriaId: CategoriasEnum.PrestacoesServico }
                })}
            >
                <Avatar.Image
                    size={60}
                    style={[styles.avatarContain]}
                    source={icone1}
                />

                <Text
                    style={[styles.montserrat, styles.textDescription]}
                >
                    Prestação de Serviços
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.containCategoryIcon]}
                onPress={() => navigation.navigate(ROUTES.agendamentoMenu, {
                    screen: ROUTES.agendamento,
                    params: { categoriaId: CategoriasEnum.Saude }
                })}
            >
                <Avatar.Image
                    size={60}
                    style={[styles.avatarContain]}
                    source={icone3}
                />

                <Text
                    style={[styles.montserrat, styles.textDescription]}
                >
                    Saúde
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default IconsCategory;
