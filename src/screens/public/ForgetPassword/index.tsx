import { View, Text } from 'react-native';
import React, { useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LinearProgress } from '@rneui/themed';
import * as yup from 'yup';

import { Button } from 'react-native-paper';
import Header from '../components/Header';
import SemiHeader from '../../../components/SemiHeader';
import InputControl from '../../../components/InputControl';

import { forgotPassword } from '../../../services/api/authServices/forgotPassword';

import styles from './styles';
import { globalColors } from '../../../global/styleGlobal';
import { PUBLIC_ROUTES } from '../../../routes/config/publicRoutesNames';
import { MotiView } from 'moti';
import { NotificacaoContext, NotificacaoContextData } from '../../../contexts/NotificacaoProvider';

const schema = yup.object({
    email: yup
        .string()
        .required('Preencha com seu e-mail!')
        .email('Formato inválido de e-mail!'),
});

interface FormObject {
    email: string;
}

const ForgetPassword: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { showNotificacao } = useContext<NotificacaoContextData>(NotificacaoContext);
    const [loadingModal, setLoadingModal] = useState<boolean>(false);
    const [showProgressBar, setShowProgressBar] = useState<boolean>(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormObject>({
        resolver: yupResolver(schema),
    });

    async function submitForm(form: FormObject) {
        setShowProgressBar(true);
        let resultado = await forgotPassword(form.email);
        setShowProgressBar(false);

        if(!resultado.success) {
            showNotificacao(resultado.message, 'danger');
            return;
        }

        navigation.navigate(PUBLIC_ROUTES.AlterarSenha, { email: form.email });
    };

    return (
        <View style={[styles.contain]}>
            <View>
                <Header />
                <SemiHeader titulo='Esqueci minha senha' />

            </View>

            <View style={[styles.containContentInput]}>
                <Text
                    style={[
                        styles.montserrat,
                        styles.colorDefault,
                        styles.textLabelInput,
                    ]}
                >
                    Tudo começa aqui
                </Text>
                <InputControl
                    label="Digite seu email"
                    name="email"
                    control={control}
                    error={errors.email ? true : false}
                    errorText={errors.email?.message}
                />
            </View>

            <View style={styles.btnsActions}>
            {showProgressBar && (
                    <MotiView
                        style={[styles.containProgressBar]}
                        from={{
                            opacity: 0,
                            marginVertical: 0,
                        }}
                        animate={{
                            opacity: 1,
                            marginVertical: 20,
                        }}
                    >
                        <LinearProgress color="#52c7e2" />
                    </MotiView>
                )}
                <Button
                    mode="contained"
                    contentStyle={styles.btnSendContainer}
                    style={styles.btnSend}
                    buttonColor={globalColors.primaryColor}
                    onPress={handleSubmit(submitForm)}
                >
                    ALTERAR SENHA
                </Button>
            </View>
        </View>
    );
};

export default ForgetPassword;
