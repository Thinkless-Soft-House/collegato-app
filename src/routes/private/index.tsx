import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerHeaderProps } from '@react-navigation/drawer';

import Compromise from '../../screens/private/Compromise';
import Home from '../../screens/private/Home';
import Message from '../../screens/private/Message';
import ChatMessage from '../../screens/private/Message/components/chat';
import MyProfile from '../../screens/private/MyProfile';
import MyCompany from '../../screens/private/MyCompany';
import Schedule from '../../screens/private/Schedule';
import Scheduling from '../../screens/private/Scheduling';
import Companies from '../../screens/private/Companies';
import AddCompany from '../../screens/private/Companies/components/AddCompany';
import Contact from '../../screens/private/Contact';
import Report from '../../screens/private/Report';

import Users from '../../screens/private/Users';
import AddUser from '../../screens/private/Users/components/AddUser';
import Rooms from '../../screens/private/Rooms';
import AddRoom from '../../screens/private/Rooms/components/AddRoom';
import Ombudsman from '../../screens/private/Ombudsman';
import ChatOmbudsman from '../../screens/private/Ombudsman/components/chat';
import Header from '../../screens/private/components/Header';
import DrawerContent from './components/DrawerContent';
import { ROUTES } from '../config/routesNames';

export type PrivateStackParams = {
    Agendar: object | undefined;
    Faturamento: object | undefined;
    Compromissos: object | undefined;
    Home: object | undefined;
    Recados: object | undefined;
    'Meu Perfil': object | undefined;
    Agendamento: object | undefined;
    'Empresas Config': object | undefined;
    'Empregados Config': object | undefined;
    'Partições Config': object | undefined;
    'Usuários Config': object | undefined;
    EditHome: object | undefined;
    AddPlace: object | undefined;
    EditProfile: object | undefined;
    myProfile: object | undefined;
    'Usuários': object | undefined;
    'Adicionar Usuário': object | undefined;
    'Editar Usuário': object | undefined;
    'Exclude Users': object | undefined;
    'All Company': object | undefined;
    'Add Company': object | undefined;
    'Edit Company': object | undefined;
    'Exclude Company': object | undefined;
    'All Rooms': object | undefined;
    'New Room': object | undefined;
    'Calendar Schedule': object | undefined;
    'Config Room': object | undefined;
    'Break Resgistred': object | undefined;
    'Register Break': object | undefined;
    Ouvidoria: object | undefined;
};

interface IDataParams {
    color: string;
    size: number;
}

const StackSchedule: React.FC = () => (
    <Stack.Navigator initialRouteName={ROUTES.agendamento} screenOptions={{ headerShown: false }}>
        <Stack.Screen name={ROUTES.agendamento} component={Scheduling} />
        <Stack.Screen options={{unmountOnBlur: true}} name={ROUTES.agendar} component={Schedule} />
    </Stack.Navigator>
);

const StackOmbudsman: React.FC = () => (
    <Stack.Navigator initialRouteName={ROUTES.ouvidoria} screenOptions={{ headerShown: false }}>
        <Stack.Screen name={ROUTES.ouvidoria} component={Ombudsman} />
        <Stack.Screen name={ROUTES.chatOuvirodira} component={ChatOmbudsman} />
    </Stack.Navigator>
);

const StackMessage: React.FC = () => (
    <Stack.Navigator initialRouteName={ROUTES.recados} screenOptions={{ headerShown: false }}>
        <Stack.Screen name={ROUTES.recados} component={Message} />
        <Stack.Screen name={ROUTES.chatRecados} component={ChatMessage} />
    </Stack.Navigator>
);

const StackCrudRooms: React.FC = () => (
    <Stack.Navigator initialRouteName={ROUTES.salas} screenOptions={{ headerShown: false }}>
        <Stack.Screen name={ROUTES.salas} component={Rooms} />
        <Stack.Screen name={ROUTES.adicionarSala} component={AddRoom} />
    </Stack.Navigator>
);

const StackCrudCompany: React.FC = () => (
    <Stack.Navigator initialRouteName={ROUTES.empresas} screenOptions={{ headerShown: false }}>
        <Stack.Screen name={ROUTES.empresas} component={Companies} />
        <Stack.Screen name={ROUTES.adicionarEmpresa} component={AddCompany} />
    </Stack.Navigator>
);

const StackCrudUsers: React.FC = () => (
    <Stack.Navigator initialRouteName={ROUTES.usuarios} screenOptions={{ headerShown: false }}>
        <Stack.Screen name={ROUTES.usuarios} component={Users} />
        <Stack.Screen name={ROUTES.adicionarUsuario} component={AddUser} />
        <Stack.Screen name={ROUTES.editarUsuario} component={AddUser} />
    </Stack.Navigator>
);

const StackHomeEdit: React.FC = () => (
    <Stack.Navigator initialRouteName={ROUTES.home} screenOptions={{ headerShown: false }}>
        <Stack.Screen name={ROUTES.home} component={Home} />
    </Stack.Navigator>
);

const Stack: any = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const PrivateRoutes = () => (
    <Drawer.Navigator
    initialRouteName="Home"
    drawerContent={(props: DrawerContentComponentProps) => <DrawerContent {...props} />}
    screenOptions={{
        header: (props: DrawerHeaderProps) => <Header {...props} />
    }}>
        <Drawer.Screen name={ROUTES.homeMenu} component={StackHomeEdit} />
        <Drawer.Screen name={ROUTES.usuariosMenu} component={StackCrudUsers} />
        <Drawer.Screen name={ROUTES.salasMenu} component={StackCrudRooms} />
        <Drawer.Screen name={ROUTES.empresasMenu} component={StackCrudCompany} />
        <Drawer.Screen name={ROUTES.ouvidoriaMenu} component={StackOmbudsman} />
        <Drawer.Screen name={ROUTES.agendamentoMenu} options={{ headerTitle: "Teste" }} component={StackSchedule} />
        <Drawer.Screen name={ROUTES.recadosMenu} component={StackMessage} />
        <Drawer.Screen name={ROUTES.compromisso} component={Compromise} />
        <Drawer.Screen name={ROUTES.meuPerfil} component={MyProfile} />
        <Drawer.Screen name={ROUTES.minhaEmpresa} component={MyCompany} />
        <Drawer.Screen name={ROUTES.contato} component={Contact} />
        <Drawer.Screen name={ROUTES.relatorio} component={Report} />
    </Drawer.Navigator>
);

export default PrivateRoutes;
