import React, { useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearProgress } from '@rneui/themed';
import { MotiView } from 'moti';
import { TextInput, Button, Checkbox } from 'react-native-paper';
import { useNavigation } from '@react-navigation/core';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as LocalAuthentication from 'expo-local-authentication';
import * as yup from 'yup';

import {
    View,
    ScrollView,
    Text,
    Modal,
    LogBox,
    TouchableOpacity,
} from 'react-native';
import Loading from '../components/Loading';
import Header from '../components/Header';
import ModalAcceptAllTerms from '../components/ModalAcceptAllTerms';
import IntroSlider from '../IntroSlider';

import { logIn } from '../../../services/api/authServices/logIn';

import { PUBLIC_ROUTES } from '../../../routes/config/publicRoutesNames';
import { AuthContext, ILoginData } from '../../../services/auth';
import { globalColors } from '../../../global/styleGlobal';

import styles from './styles';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputControl from '../../../components/InputControl';
import { NotificacaoContext, NotificacaoContextData } from '../../../contexts/NotificacaoProvider';
import { plataformaIOS } from '../../../helpers/styleHelpers';
import { loginKey } from '../../../services/api/authServices/loginKey';


const schema = yup.object({
    login: yup
        .string()
        .required('Preencha com seu e-mail!')
        .email('Formato inválido de e-mail!'),
    senha: yup.string().required('Campo obrigatório')
});

interface FormObject {
    login: string;
    senha: string;
}

const SingIn: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { limparLogin, adicionarUsuarioLogado } = useContext<ILoginData>(AuthContext);
    const { showNotificacao } = useContext<NotificacaoContextData>(NotificacaoContext);

    const [showPass, setShowPass] = useState<boolean>(false);
    const [showSlider, setShowSlider] = useState<boolean>(true);
    const [showProgressBar, setShowProgressBar] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [firstAccess, setFirstAccess] = useState<boolean>(false);
    const [saveLoginChecked, setSaveLoginChecked] = useState<boolean>(false);
    const [acessoDigital, setAcessoDigital] = useState<boolean>(false);
    const [possuiScanner, setPossuiScanner] = useState<boolean>(false);
    const [login, setLogin] = useState<string>("");

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormObject>({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        LogBox.ignoreAllLogs(true);
        checkAcceptAllterms();
        validarScannerAcessoDigital();
        buscarDadosIniciais();
        if (!firstAccess) checkToken();
        else setLoading(false);
    }, []);

    useEffect(() => {
        if (!firstAccess) checkToken();
    }, [firstAccess]);

    useEffect(() => {
        if (acessoDigital && possuiScanner) {
            handleAcessoDigital();
        }
    }, [acessoDigital]);

    async function validarScannerAcessoDigital() {
        const possuiFaceOrScanner = await LocalAuthentication.hasHardwareAsync();
        setPossuiScanner(possuiFaceOrScanner);
    }

    async function handleAcessoDigital() {
        const loginInput: string = login ? login : await AsyncStorage.getItem('Login'); 
        const dynamicLabel = plataformaIOS() ? "FaceID" : "Empressão Digital";  

        if(!loginInput || loginInput.trim() == "") {
            setAcessoDigital(false);
            showNotificacao(`Preencha o campo de e-mail para autenticar por ${dynamicLabel}.`, 'warning');
            return;
        }

        await AsyncStorage.setItem('LoginDigital', acessoDigital.toString());

        const possuiFaceOrScanner = await LocalAuthentication.hasHardwareAsync();
        if(!possuiFaceOrScanner) {
            setAcessoDigital(false);
            showNotificacao(`Nenhum ${dynamicLabel} encontrado. Por favor preencha seu login e senha.`, 'warning');
            return;
        }

        const result = await LocalAuthentication.supportedAuthenticationTypesAsync();

        if(result.length == 0) {
            setAcessoDigital(false);
            showNotificacao(`${dynamicLabel} não suportado pelo dispositivo. Por favor preencha seu login e senha.`, 'warning');
            return;
        }

        const possuiDadosSalvos = await LocalAuthentication.isEnrolledAsync();
        if(!possuiDadosSalvos) {
            setAcessoDigital(false);
            showNotificacao(`Nenhum ${dynamicLabel} encontrado. Por favor preencha seu login e senha.`, 'warning');
            return;
        }

        const autenticacao = await LocalAuthentication.authenticateAsync({
            cancelLabel: "Cancelar",
            promptMessage: "Verificação de identidade, " +
            plataformaIOS() ? "autenticação por FaceID.": "toque no sensor de impressão digital.",
            disableDeviceFallback: true
        });

        if (!autenticacao.success) {
            setAcessoDigital(false);
            return;
        }

        setShowProgressBar(true);
        let resultado = await loginKey(loginInput);
        setShowProgressBar(false);

        if (!resultado.success) {
            setAcessoDigital(false);
            showNotificacao(resultado.message, 'danger');
            return;
        }

        await AsyncStorage.setItem('SaveLogin', saveLoginChecked.toString());

        if (saveLoginChecked) {
            await AsyncStorage.setItem('Login', loginInput);
        }
        else {
            await AsyncStorage.removeItem('Login');
        }

        await AsyncStorage.setItem('Token', resultado.result.token);
        adicionarUsuarioLogado(resultado.result);
    }

    const checkAcceptAllterms: Function = (): void => {
        AsyncStorage.getItem('AceptAllTerms').then((response) => {
            if (response !== null && response !== '') {
                if (response === 'true') {
                    setFirstAccess(true);
                    setLoading(false);
                }
            }
        });
    };

    const checkToken = async (): Promise<void> => {
        setLoading(false);
        limparLogin();
        return;

        // let token = await AsyncStorage.getItem('Token');
        // if (!token) {
        //     setLoading(false);
        //     setShowSlider(true);
        //     limparLogin();
        //     return;
        // }

        // const dataToken: TokenDTO = jwt_decode(token);
        // let resultadoUsuario = await getUsuarioPorId(dataToken.id);

        // if (!resultadoUsuario.success) {
        //     setLoading(false);
        //     setShowSlider(true);
        //     limparLogin();
        //     return;
        // }

        // setLoading(false);
        // adicionarUsuarioLogado(resultadoUsuario.result);
    };

    async function buscarDadosIniciais() {
        const loginDigital = await AsyncStorage.getItem('LoginDigital');
        const isLoginDigital: boolean = loginDigital == "true" ? true : false;
        setAcessoDigital(isLoginDigital);

        const loginSaved = await AsyncStorage.getItem('SaveLogin');
        const saveLogin: boolean = loginSaved == "true" ? true : false;
        setSaveLoginChecked(saveLogin);

        const login = await AsyncStorage.getItem('Login');
        const senha = await AsyncStorage.getItem('Senha');

        if (saveLogin) {
            setValue('login', login ? login : "");
            setValue('senha', senha ? senha : "");
        }
    }

    async function formSubmit(form: FormObject) {
        setShowProgressBar(true);
        let resultado = await logIn(form.login, form.senha);
        setShowProgressBar(false);

        if (!resultado.success) {
            showNotificacao("Login ou senha inválidos", 'danger');
            return;
        }

        await AsyncStorage.setItem('SaveLogin', saveLoginChecked.toString());
        await AsyncStorage.setItem('LoginDigital', acessoDigital.toString());
        
        if (saveLoginChecked) {
            await AsyncStorage.setItem('Login', form.login);
            await AsyncStorage.setItem('Senha', form.senha);
        }
        else {
            await AsyncStorage.removeItem('Login');
            await AsyncStorage.removeItem('Senha');
        }

        await AsyncStorage.setItem('Token', resultado.result.token);
        adicionarUsuarioLogado(resultado.result);
    }

    if (loading) {
        return <Loading />;
    }
    if (!showSlider || 1 == 1) {
        return (
            <View style={[styles.contain]}>
                <Header />
                <ScrollView contentContainerStyle={[styles.containContentPage]}>
                    <View>
                        <View style={[styles.containInput]}>
                            <InputControl
                                label="Digite seu email"
                                name="login"
                                control={control}
                                onChangeValue={value => setLogin(value)}
                                error={errors.login ? true : false}
                                errorText={errors.login?.message}
                            />
                        </View>

                        <View style={[styles.containInput]}>
                            <InputControl
                                label="Digite sua senha"
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
                        </View>

                        <View style={[styles.containInput]}>
                            <TouchableOpacity style={styles.checkboxContainer} onPress={() => setSaveLoginChecked(!saveLoginChecked)}>
                                <Text style={styles.checkboxLabel}>
                                    Lembrar meu usuário
                                </Text>
                                <Checkbox.Android
                                    color={globalColors.primaryColor}
                                    status={saveLoginChecked ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setSaveLoginChecked(!saveLoginChecked);
                                    }}
                                />
                            </TouchableOpacity>

                            {possuiScanner && (
                                <TouchableOpacity style={styles.checkboxContainer} onPress={() => setAcessoDigital(!acessoDigital)}>
                                    <Text style={styles.checkboxLabel}>
                                        Habilitar acesso com digital
                                    </Text>
                                    <Checkbox.Android
                                        color={globalColors.primaryColor}
                                        status={acessoDigital ? 'checked' : 'unchecked'}
                                        onPress={() => {
                                            setAcessoDigital(!acessoDigital);
                                        }}
                                    />
                                </TouchableOpacity>
                            )}

                        </View>

                        <Button
                            mode="text"
                            textColor={globalColors.secondaryColor}
                            onPress={() => navigation.navigate(PUBLIC_ROUTES.EsqueciSenha)}>
                            <Text style={styles.btnText}>Esqueci minha senha</Text>
                        </Button>

                        <View style={[styles.containFirstAccess]}>
                            <Button
                                mode="text"
                                textColor={globalColors.secondaryColor}
                                onPress={() => navigation.navigate(PUBLIC_ROUTES.PrimeiroAcesso)}>
                                <Text style={styles.btnText}>Sua conta ainda não possui senha?</Text>
                            </Button>
                        </View>
                    </View>

                    <View style={[styles.containBtn]}>
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
                            style={styles.btnEntrar}
                            onPress={handleSubmit(formSubmit)}>
                            ENTRAR
                        </Button>

                        <Button
                            mode="outlined"
                            contentStyle={styles.btnSendContainer}
                            style={styles.btnRegistrar}
                            textColor={globalColors.secondaryColor}
                            onPress={() => navigation.navigate(PUBLIC_ROUTES.Cadastro)}>
                            REGISTRAR
                        </Button>
                    </View>
                </ScrollView>
            </View>
        );
    }
    return (
        <View style={[styles.contain]}>
            <Header />

            <IntroSlider goBack={setShowSlider} verify={showSlider} />

            <Modal transparent visible={firstAccess} animationType="none">
                <ModalAcceptAllTerms lock={setFirstAccess} />
            </Modal>
        </View>
    );
};

export default SingIn;
