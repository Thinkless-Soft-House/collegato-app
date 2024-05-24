import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SingIn from '../../screens/public/SignIn';
import ForgetPassword from '../../screens/public/ForgetPassword';
import ChangePassword from '../../screens/public/ChangePassword';
import SingUp from '../../screens/public/SignUp';
import FirstAccess from '../../screens/public/FirstAccess';

import { PUBLIC_ROUTES } from '../config/publicRoutesNames';

export type PublicStackParams = {
    SingIn: object | undefined;
    ForgetPassword: object | undefined;
    SingUp: object | undefined;
    FirstAccess: object | undefined;
};

const Stack: any = createNativeStackNavigator();

const PublicRoutes = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={PUBLIC_ROUTES.Login} component={SingIn} />
        <Stack.Screen name={PUBLIC_ROUTES.EsqueciSenha} component={ForgetPassword} />
        <Stack.Screen name={PUBLIC_ROUTES.Cadastro} component={SingUp} />
        <Stack.Screen name={PUBLIC_ROUTES.PrimeiroAcesso} component={FirstAccess} />
        <Stack.Screen name={PUBLIC_ROUTES.AlterarSenha} component={ChangePassword} />
    </Stack.Navigator>
);

export default PublicRoutes;
