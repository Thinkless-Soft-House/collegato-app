import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import React, { useContext } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Avatar } from '@rneui/themed';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import logo1 from '../../../../assets/logo1.png';
import logo2 from '../../../../assets/logo2.png';
import logo3 from '../../../../assets/logo3.png';
import logo4 from '../../../../assets/logo4.png';
import logo5 from '../../../../assets/logo5.png';

import Carousel from './components/Caroucel';
import IconsCategory from './components/IconsNavigate';
import VideoHome from './components/VideoHome';

import { postSalvarPushToken } from '../../../services/api/usuarioServices/postSalvarPushToken';

import { AuthContext, ILoginData } from '../../../services/auth';
import { PrivateStackParams } from '../../../routes/private';
import styles from './styles';

interface IDataAvatar {
    avatarPhoto: ImageData;
    id?: number;
}

const avatarsLogos: IDataAvatar[] = [
    {
        avatarPhoto: logo1,
    },
    {
        avatarPhoto: logo2,
    },
    {
        avatarPhoto: logo3,
    },
    {
        avatarPhoto: logo4,
    },
    {
        avatarPhoto: logo5,
    },
];

const Home: React.FC = () => {
    const { dataLoginUser, usuarioLogado } = useContext<ILoginData>(AuthContext);
    const navigation =
        useNavigation<NativeStackNavigationProp<PrivateStackParams>>();


    async function registerForPushNotificationsAsync() {
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            const token = (await Notifications.getExpoPushTokenAsync()).data;
            postSalvarPushToken(usuarioLogado.id, token);
        } else {
            alert('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#ffffff',
            });
        }
    };

    return (
        <ScrollView style={[styles.contain]}>
            {dataLoginUser.permission === 1 && (
                <TouchableOpacity
                    style={[styles.containEditHome]}
                    onPress={() => {
                        navigation.navigate('EditHome');
                    }}
                >
                    <Icon name="home-edit" size={35} color="red" />
                    <Text style={[styles.montserrat, styles.textEditHome]}>
                        Editar Home
                    </Text>
                </TouchableOpacity>
            )}

            <Carousel />

            <View style={[styles.containCategory, styles.paddingLeft]}>
                <Text style={[styles.montserrat, styles.textCategory]}>
                    Agende por categoria
                </Text>
                <View style={[styles.IconsCategory]}>
                    <IconsCategory label />
                </View>
            </View>

            <VideoHome />

            <View style={[styles.containCategory]}>
                <Text
                    style={[
                        styles.montserrat,
                        styles.textCategory,
                        styles.paddingLeft,
                    ]}
                >
                    Médicos, advogados, restaurantes, coworkings...
                </Text>
                <ScrollView style={[styles.containOptions]} horizontal>
                    {avatarsLogos.map((item, id) => (
                        <Avatar
                            size={60}
                            rounded
                            containerStyle={[styles.avatarContain]}
                            source={item.avatarPhoto}
                            key={id}
                        />
                    ))}
                </ScrollView>
            </View>
        </ScrollView>
    );
};

export default Home;
