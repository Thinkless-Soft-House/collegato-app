import React, { createContext, useState, PropsWithChildren } from 'react';
import { Pessoa } from '../../models/pessoa';
import { Usuario } from '../../models/usuario';

export type ILoginData = {
    dataLoginUser: IUserData;
    setUser: Function;
    logado: boolean;
    setLogado: Function;
    IUserData?: IUserData;
    usuarioLogado: Usuario;
    setUsuarioLogado: Function;
    pessoaLogada: Pessoa;
    setPessoaLogada: Function;
    adicionarUsuarioLogado(usuario: Usuario): void;
    limparLogin: Function;
};

export type IUserData = {
    exp: number;
    iat: number;
    id: number;
    name: string;
    permission: number;
    sub: string;
    dataLoginUser: IUserData;
};

export const AuthContext = createContext<ILoginData>({} as ILoginData);

const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [userData, setUserData] = useState<IUserData>({} as IUserData);
    const [usuarioLogado, setUsuarioLogado] = useState<Usuario>({} as Usuario);
    const [pessoaLogada, setPessoaLogada] = useState<Pessoa>({} as Pessoa);
    const [logado, setLogado] = useState(false);

    function adicionarUsuarioLogado(usuario: Usuario) {
        setUsuarioLogado(usuario);
        setPessoaLogada(usuario.pessoa)
        setLogado(true);
    }

    function limparLogin() {
        setLogado(false);
        setUserData({} as IUserData);
        setUsuarioLogado({} as Usuario);
        setPessoaLogada({} as Pessoa);
    }

    return (
        <AuthContext.Provider
            value={{
                dataLoginUser: userData,
                setUser: setUserData,
                usuarioLogado,
                setUsuarioLogado,
                pessoaLogada,
                setPessoaLogada,
                logado,
                setLogado,
                limparLogin,
                adicionarUsuarioLogado
            }}
        >
            {children && children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
