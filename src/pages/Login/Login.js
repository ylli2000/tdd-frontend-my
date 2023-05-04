import './Login.css';
import { useState, useContext } from 'react';
import { InputsDmo, loginDto } from './Login.model';
import { AuthContext } from '../../SoCs/AuthContext/AuthContext';
import { usePhase } from '../../Hooks/usePhase/usePhase';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { post } from '../../helpers/Crud';
import { Container, Header, Divider, Form, Segment, Input, Button, Message } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { useEffect, useLayoutEffect, useRef } from 'react/cjs/react.development';

const Login = () => {
    const [inputs, setInputs] = useState(InputsDmo());
    const [viewPswd, setViewPswd] = useState('password');
    const navigate = useNavigate();
    const { authed, assignAuth } = useContext(AuthContext);
    const { t } = useTranslation();
    const location = useLocation();
    const { errors, setPhase, phaseHandlers, isSucceed, isFailed, isLoading, errorMessage } = usePhase();

    const usrRef = useRef();
    const pswdRef = useRef();

    useLayoutEffect(() => {
        console.log('useLayoutEffect --------------');
        console.log(usrRef.current.inputRef.current.value);
        console.log(pswdRef.current.inputRef.current.value);
    });
    useEffect(() => {
        console.log('useEffect -------------------');
        console.log(usrRef.current.inputRef.current.value);
        console.log(pswdRef.current.inputRef.current.value);
    });
    const onChangeInput = (evt) => {
        const { id, value } = evt.target;
        setInputs({
            ...inputs,
            [id]: value,
        });
    };
    const submitDisabled = () => {
        const { email, password } = inputs;
        return (
            !email.match(
                /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
            ) || !password.match(/^.{3,99}$/)
        );
    };
    const onMouseDown = (evt) => {
        setViewPswd('text');
    };
    const onMouseUp = (evt) => {
        setViewPswd('password');
    };
    const onLoginClick = async (evt) => {
        evt.preventDefault();
        //or
        //const username = event.target.elements.username.value
        //const password = event.target.elements.password.value
        //const email = event.target.elements.email.value
        await post('/api/1.0/auth', loginDto(inputs), {
            ...phaseHandlers,
            succeed: (res) => {
                assignAuth(res.data);
                setPhase('server_succeed');
                navigate('/Manage/');
            },
        });
    };
    console.log('render -------------------');
    return (
        <Container aria-label={t('login_page')} className="Login">
            {!isSucceed() || authed ? (
                <Container>
                    <Header as="h2" textAlign="center" color="teal">
                        {t('login_user')}
                    </Header>
                    <Segment padded raised>
                        <Form size="large">
                            <Form.Field error={!!errors && !!errors.email}>
                                <Input
                                    id="email"
                                    icon="mail"
                                    iconPosition="left"
                                    placeholder={t('login_email')}
                                    onChange={onChangeInput}
                                    ref={usrRef}
                                />
                            </Form.Field>
                            <Form.Field error={!!errors && !!errors.password}>
                                <Input
                                    id="password"
                                    icon="lock"
                                    iconPosition="left"
                                    placeholder={t('login_password')}
                                    type={viewPswd}
                                    action={{
                                        basic: true,
                                        icon: 'eye',
                                        'aria-label': t('show'),
                                        onMouseDown: onMouseDown,
                                        onMouseUp: onMouseUp,
                                    }}
                                    onChange={onChangeInput}
                                    ref={pswdRef}
                                />
                            </Form.Field>
                            <Button
                                fluid
                                color="teal"
                                size="large"
                                type="submit"
                                aria-label={t('log_in')}
                                disabled={submitDisabled() || isLoading()}
                                loading={isLoading()}
                                onClick={onLoginClick}>
                                {t('log_in')}
                            </Button>
                        </Form>
                        {isFailed() ? <Message error>{errorMessage()}</Message> : <Divider />}
                        <Message>
                            {t('do_not_have_an_account')}
                            <a href="/SignUp/">{t('sign_up_here')}</a>
                        </Message>
                    </Segment>
                </Container>
            ) : (
                <Navigate to="/Manage/" replace state={{ path: location.pathname }} />
            )}
        </Container>
    );
};
export default Login;
