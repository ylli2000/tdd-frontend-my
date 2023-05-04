import { useState } from 'react';
import { Message } from 'semantic-ui-react';
import { PhaseDmo } from './usePhase.model';
import { useTranslation } from 'react-i18next';

//this is for tracking the phase of a form submission
//for example, loading, succeed, failed, client/server side....
export const usePhase = () => {
    const { t } = useTranslation();
    const [phase, setPhase] = useState(PhaseDmo());
    const update = (p, err) => {
        let res;
        if (typeof p === 'string') res = { phase: p };
        if (typeof p === 'object') res = p;
        if (err && err.message) res.message = err.message;
        if (err && err.validationErrors) res.errors = err.validationErrors;
        if (res) setPhase({ ...phase, ...res });
    };
    return {
        ...phase,
        setPhase: update,
        phaseHandlers: {
            before: () => update('server_loading'),
            succeed: () => update('server_succeed'),
            rejected: (err) => update('server_failed', err),
            internal: () => update('server_failed', { message: t('contact_tech_support') }),
            final: () => {},
        },
        // repeat_password_failed, client_failed, server_failed
        isFailed: () => !!phase.phase.match(/^.*_failed$/),
        isLoading: () => phase.phase === 'server_loading',
        isSucceed: () => phase.phase === 'server_succeed',
        errorMessage: () => {
            return phase.errors && Object.keys(phase.errors).length ? (
                <>
                    <Message.Content>
                        {phase.phase === 'server_failed' ? t('service_failure') : t('validation_failure')}
                    </Message.Content>
                    <Message.List>
                        {Object.values(phase.errors)
                            .filter((err) => !!err)
                            .map((err, i) => (
                                <Message.Item key={i}>{err}</Message.Item>
                            ))}
                    </Message.List>
                </>
            ) : phase.message ? (
                <Message.Content>{phase.message}</Message.Content>
            ) : (
                <></>
            );
        },
    };
};
