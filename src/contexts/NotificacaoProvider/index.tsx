import React, { createContext, useState, PropsWithChildren } from 'react';
import { NotificacaoConfig, NotificaoTipo } from '../../components/Notificacao';

export type NotificacaoContextData = {
    notificacao,
    notificaoVisivel,
    showNotificacao(mensagem: string, tipo: NotificaoTipo): void,
    fecharNotificacao(),
};

export const NotificacaoContext = createContext<NotificacaoContextData>({} as NotificacaoContextData);

const NotificacaoProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [notificaoVisivel, setNotificacaoVisivel] = useState<boolean>(false);
    const [notificacao, setNotificacao] = useState<NotificacaoConfig>({ notificacao: "" });

    function showNotificacao(mensagem: string, tipo: NotificaoTipo) {
        setNotificacao({
            notificacao: mensagem,
            tipo: tipo
        });
        setNotificacaoVisivel(true);
    }

    function fecharNotificacao() {
        setNotificacaoVisivel(false);
    }

    return (
        <NotificacaoContext.Provider
            value={{
                notificacao,
                notificaoVisivel,
                showNotificacao,
                fecharNotificacao
            }}
        >
            {children && children}
        </NotificacaoContext.Provider>
    );
}

export default NotificacaoProvider;
