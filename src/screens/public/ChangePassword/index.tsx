import { View, ScrollView, Text, TouchableOpacity, Alert, Modal } from 'react-native';
import React, { useCallback, useContext, useState } from 'react';
import { CommonActions, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Button, TextInput } from 'react-native-paper';
import Header from '../components/Header';
import SemiHeader from '../../../components/SemiHeader';
import InputControl from '../../../components/InputControl';

import { resetPassword } from '../../../services/api/authServices/resetPassword';

import styles from './styles';
import { globalColors } from '../../../global/styleGlobal';
import { PUBLIC_ROUTES } from '../../../routes/config/publicRoutesNames';
import { MotiView } from 'moti';
import { LinearProgress } from '@rneui/themed';
import { NotificacaoContext, NotificacaoContextData } from '../../../contexts/NotificacaoProvider';

const schema = yup.object({
    codigo: yup
        .string()
        .length(6, "O Código precisa ter 6 caracteres!")
        .required('Campo obrigatório'),
    senha: yup.string()
        .required('Campo obrigatório')
        .min(4, 'Precisa ter mais que 4 digitos'),
    senhaConfirma: yup.string().required('Campo obrigatório').oneOf([yup.ref('senha'), null], 'As senhas devem ser iguais'),
})

interface FormChangePasswordObject {
    codigo: string;
    senha: string;
    senhaConfirma: string;
}

interface ChangePasswordParams {
    email: string;
}

const ChangePassword: React.FC = (props: any) => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute();
    const { showNotificacao } = useContext<NotificacaoContextData>(NotificacaoContext);
    const [params, setParams] = useState<ChangePasswordParams>();
    const [showPass, setShowPass] = useState<boolean>(false);
    const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);
    const [showProgressBar, setShowProgressBar] = useState<boolean>(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormChangePasswordObject>({
        resolver: yupResolver(schema),
    });

    useFocusEffect(
        useCallback(() => {
            const params = route.params as ChangePasswordParams;
            if(params) {
                setParams(params);
            }
            else {
                setParams(null);
            }
        }, [props.route.params])
    );

    async function formSubmit(form: FormChangePasswordObject) {
        if(!params) {
            showNotificacao("E-mail não encontrado", 'danger');
            return;
        }

        setShowProgressBar(true);
        let resultado = await resetPassword(params.email, form.codigo, form.senha);
        setShowProgressBar(false);

        if(!resultado.success) {
            showNotificacao(resultado.message, 'danger');
            return;
        }

        showNotificacao(resultado.message, 'success');

        navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                { name: PUBLIC_ROUTES.Login },
              ],
            })
          );
    }

    return (
        <View style={[styles.contain]}>
            <View>
                <Header />
                <SemiHeader titulo='Altere sua senha' />
            </View>

            <View style={[styles.containContentInput]}>
                <View style={styles.notificao}>
                    <Text style={styles.notificaoText}>
                        Enviamos um e-mail com o código para
                        redefinir sua senha.
                    </Text>
                </View>

                <InputControl
                    label="Digite o código que enviamos para você!"
                    name="codigo"
                    control={control}
                    keyboardType='number-pad'
                    error={errors.codigo ? true : false}
                    errorText={errors.codigo?.message}
                />

                <InputControl
                    style={styles.inputs}
                    label="Nova senha"
                    name="senha"
                    control={control}
                    secureTextEntry={!showPass}
                    error={errors.senha ? true : false}
                    errorText={errors.senha?.message}
                    right={
                        <TextInput.Icon
                            onPress={() => setShowPass(!showPass)}
                            icon={showPass ? 'eye-off' : 'eye'}
                            forceTextInputFocus={false}
                        />
                    }
                />

                <InputControl
                    style={styles.inputs}
                    label="Confirme a senha"
                    name="senhaConfirma"
                    control={control}
                    secureTextEntry={!showConfirmPass}
                    error={errors.senhaConfirma ? true : false}
                    errorText={errors.senhaConfirma?.message}
                    right={
                        <TextInput.Icon
                            onPress={() => setShowConfirmPass(!showConfirmPass)}
                            icon={showConfirmPass ? 'eye-off' : 'eye'}
                            forceTextInputFocus={false}
                        />
                    }
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
                    onPress={handleSubmit(formSubmit)}
                >
                    ALTERAR SENHA
                </Button>
            </View>
        </View>
    );
};

export default ChangePassword;
