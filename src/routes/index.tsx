import React, { useContext } from 'react';
import PublicRouter from '../routes/public';
import PrivateRoutes from '../routes/private';
import { AuthContext } from '../services/auth';
import { NotificacaoContext, NotificacaoContextData } from '../contexts/NotificacaoProvider';
import { Notificacao } from '../components/Notificacao';

const AppRoutes: React.FC = () => {
    const { logado } = useContext(AuthContext);
    const { fecharNotificacao, notificacao, notificaoVisivel } = useContext<NotificacaoContextData>(NotificacaoContext);

    return (
        <>
            {logado === true ? <PrivateRoutes /> : <PublicRouter />}

            <Notificacao
                config={notificacao}
                visivel={notificaoVisivel}
                onDismiss={() => fecharNotificacao()}
                onPress={() => fecharNotificacao()}
            />
        </>
    )

};

export default AppRoutes;
