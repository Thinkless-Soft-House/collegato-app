import {
    View,
    Alert,
    Modal,
} from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import jwt_decode from 'jwt-decode';

import { Button, TextInput } from 'react-native-paper';
import InputControl from '../../../../../components/InputControl';
import Loading from '../../../components/Loading';
import Header from '../../../components/Header';
import SemiHeader from '../../../../../components/SemiHeader';
import ModalAcceptAllTerms from '../../../components/ModalAcceptAllTerms';

import { globalColors } from '../../../../../global/styleGlobal';
import { AuthContext } from '../../../../../services/auth';

import styles from './styles';

interface IMakePass {
    password: string;
    confirmPassword: string;
}

interface IProps {
    token?: string;
}

const schema = yup.object({
    password: yup
        .string()
        .required('Preencha com uma senha de sua escolha!')
        .min(6, 'Sua senha deve conter no mínimo 6 caracteres!'),
    confirmPassword: yup
        .string()
        .required('Preencha com uma senha de sua escolha!')
        .min(6, 'Sua senha deve conter no mínimo 6 caracteres!'),
});

const DefinePassword: React.FC<IProps> = ({ token }) => {
    const [loadingModal, setLoadingModal] = useState<boolean>(false);
    const [firstAccess, setFirstAccess] = useState<boolean>(false);
    const [lockAccess, setLockAccess] = useState<boolean>(true);
    const [tokenSalved] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);

    const { setLogado } = useContext(AuthContext);

    useEffect(() => {
        if (!lockAccess && !firstAccess) {
            AsyncStorage.setItem('Token', tokenSalved);
            setLogado(true);
        }
    }, [lockAccess]);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<IMakePass>({
        resolver: yupResolver(schema),
    });

    const feedBackError = (data: any) => {
        if (data.password) Alert.alert(`Erro`, `${data.password.message}`);
        if (data.confirmPassword)
            Alert.alert(`Erro`, `${data.confirmPassword.message}`);
    };

    const setPassword = (data: any) => {
        setLoadingModal(true);
        if (data.password !== data.confirmPassword) {
            Alert.alert(
                'Erro',
                'Desculpe a senha e a confirmação de senha não são iguais!'
            );
            setLoadingModal(false);
            return;
        }

        /* const sendData = {
            password: data.password,
        };

        api
        .post('users/first_login/password', sendData, { headers: {"Authorization" : `Bearer ${token}`} })
        .then(({data}) => {
            setFirstAccess(true)
            setLoadingModal(false)
            AsyncStorage.setItem('AceptAllTerms', 'true')
            setUser(jwt_decode(data.jwt))
        })
        .catch((err) => {
            if(String(err).search('404') >= 0){
                Alert.alert('Erro', 'Desculpe o email informado não foi encontrado!')
            }
        })
        .finally(() => setLoadingModal(false)) */
        setLoadingModal(false);
        AsyncStorage.setItem('AceptAllTerms', 'true');
        setFirstAccess(true);
        Alert.alert(
            'Sucesso',
            'Aproveite o aplicativo(nesse ponto do aplicativo não e possível exibir a tela home sem estar logado em uma conta com token)!'
        );
    };

    return (
        <View style={[styles.contain]}>
            <View>
                <Header />
                <SemiHeader titulo='Definindo nova senha'/>
            </View>

            <View style={[styles.containContentInput]}>
                <InputControl
                    label="Digite sua senha"
                    name="password"
                    control={control}
                    secureTextEntry={!showPassword}
                    error={errors.password ? true : false}
                    errorText={errors.password?.message}
                    right={
                        <TextInput.Icon
                            onPress={() => setShowPassword(!showPassword)}
                            icon={showPassword ? 'eye-off' : 'eye'}
                            forceTextInputFocus={false}
                        />
                    }
                />

                <InputControl
                    label="Confirme sua senha"
                    name="confirmPassword"
                    control={control}
                    secureTextEntry={!showConfirm}
                    error={errors.confirmPassword ? true : false}
                    errorText={errors.confirmPassword?.message}
                    right={
                        <TextInput.Icon
                            onPress={() => setShowConfirm(!showConfirm)}
                            icon={showConfirm ? 'eye-off' : 'eye'}
                            forceTextInputFocus={false}
                        />
                    }
                />
            </View>

            <View style={styles.btnsActions}>
                <Modal
                    animationType="slide"
                    visible={loadingModal}
                    onRequestClose={() => setLoadingModal(false)}
                >
                    <Loading />
                </Modal>

                <Button
                    mode="contained"
                    contentStyle={styles.btnSendContainer}
                    style={styles.btnSend}
                    buttonColor={globalColors.primaryColor}
                    onPress={handleSubmit(setPassword, feedBackError)}
                >
                    CONTINUAR
                </Button>
            </View>

            <Modal transparent visible={firstAccess} animationType="none">
                <ModalAcceptAllTerms lock={setLockAccess} />
            </Modal>
        </View>
    );
};

export default DefinePassword;
