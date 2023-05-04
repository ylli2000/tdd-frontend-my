import './Activate.css';
import { post } from '../../helpers/Crud';
import { usePhase } from '../../Hooks/usePhase/usePhase';
import { Container, Message } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const Activate = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const { phaseHandlers, isSucceed, isFailed, isLoading } = usePhase();
    const didMount = useRef('');
    useEffect(() => {
        if (id && id !== didMount.current) {
            didMount.current = id;
            post(`/api/1.0/users/token/${id}`, {}, phaseHandlers);
        }
    });
    const renderMessage = () => {
        if (isLoading()) return t('loading');
        if (isSucceed()) return t('account_activation_success');
        if (isFailed()) return t('account_activation_failure');
        return t('please_provide_account_activation_code');
    };
    return (
        <Container aria-label={t('activate_page')} className="Activate">
            <Message positive={isSucceed()} negative={isFailed()}>
                <Message.Header>{t('system_message')}</Message.Header>
                <p>{renderMessage()}</p>
            </Message>
        </Container>
    );
};

export default Activate;