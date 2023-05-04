import './SignUp.css';
import { post } from '../../helpers/Crud';
import { InputsDmo, signUpDto } from './SignUp.model';
import { usePhase } from '../../Hooks/usePhase/usePhase';
import { useState } from 'react';
import { Container, Header, Divider, Form, Segment, Input, Button, Message } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
/*
NOTE: JSX Semantic UI

The UI package https://react.semantic-ui.com/
Look at the link for installation instructions and how to use it.
*/

const SignUp = () => {
    const [inputs, setInputs] = useState(InputsDmo());
    const [viewPswd, setViewPswd] = useState('password');
    const { t } = useTranslation();
    const { phase, errors, setPhase, phaseHandlers, isSucceed, isFailed, isLoading, errorMessage } = usePhase();
    const onChangeInput = (evt) => {
        const { id, value } = evt.target;
        setInputs({
            ...inputs,
            [id]: value,
        });
    };
    const submitDisabled = () => {
        const { password, password2 } = inputs;
        return !password || password !== password2;
    };
    const onMouseDown = (evt) => {
        setViewPswd('text');
    };
    const onMouseUp = (evt) => {
        setViewPswd('password');
    };
    const onBlurInputs = (evt) => {
        if (phase === 'server_failed' || phase === 'client_failed') {
            validateInputs();
        }
    };
    const onBlurPassword2 = (evt) => {
        //validate inputs
        const { value } = evt.target;
        const hasOtherErrors = errors && Object.values(errors).filter((err) => !!err).length > 1;
        if (value !== inputs.password && !errors.password2) {
            setPhase({
                phase: hasOtherErrors ? 'client_failed' : 'repeat_password_failed',
                errors: {
                    ...errors,
                    password2: t('repeat_password_does_not_match'),
                },
            });
        } else if (value === inputs.password && !!errors.password2) {
            setPhase({
                phase: hasOtherErrors ? 'client_failed' : '',
                errors: {
                    ...errors,
                    password2: '',
                },
            });
        }
    };
    const validateInputs = () => {
        const { username, email, password, password2 } = inputs;
        const res = {
            phase: '',
            errors: InputsDmo(),
        };
        let isValid = true;
        const fn = (field, condition, message) => {
            if (!condition) {
                res.phase = 'client_failed';
                res.errors[field] = message;
                isValid = false;
            }
        };
        fn('username', username.match(/^[a-zA-Z0-9]{4,32}$/), t('username_size'));
        fn(
            'email',
            email.match(
                /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
            ),
            t('email_invalid')
        );
        fn('password', password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/), t('password_pattern'));
        fn('password', password.match(/^.{6,99}$/), t('password_size'));
        fn('password2', password2 === password, t('repeat_password_does_not_match'));
        setPhase(res);
        return isValid;
    };
    const onSignUpClick = async (evt) => {
        evt.preventDefault();
        if (!validateInputs()) return;
        //or
        //const username = event.target.elements.username.value
        //const password = event.target.elements.password.value
        //const email = event.target.elements.email.value
        await post('/api/1.0/users', signUpDto(inputs), phaseHandlers);
    };
    return (
        <Container aria-label={t('sign_up_page')} className="SignUp">
            {!isSucceed() ? (
                <Container>
                    <Header as="h2" textAlign="center" color="teal">
                        {t('sign_up_for_an_account')}
                    </Header>
                    <Segment padded raised>
                        <Form size="large">
                            <Form.Field error={!!errors && !!errors.username}>
                                <Input
                                    id="username"
                                    icon="user"
                                    iconPosition="left"
                                    placeholder={t('new_username')}
                                    onChange={onChangeInput}
                                    onBlur={onBlurInputs}
                                />
                            </Form.Field>
                            <Form.Field error={!!errors && !!errors.email}>
                                <Input
                                    id="email"
                                    icon="mail"
                                    iconPosition="left"
                                    placeholder={t('new_email')}
                                    onChange={onChangeInput}
                                    onBlur={onBlurInputs}
                                />
                            </Form.Field>
                            <Form.Field error={!!errors && !!errors.password}>
                                <Input
                                    id="password"
                                    icon="lock"
                                    iconPosition="left"
                                    placeholder={t('new_password')}
                                    type={viewPswd}
                                    action={{
                                        basic: true,
                                        icon: 'eye',
                                        'aria-label': t('show'),
                                        onMouseDown: onMouseDown,
                                        onMouseUp: onMouseUp,
                                    }}
                                    onChange={onChangeInput}
                                    onBlur={onBlurInputs}
                                />
                            </Form.Field>
                            <Form.Field error={!!errors && !!errors.password2}>
                                <Input
                                    id="password2"
                                    icon="lock"
                                    iconPosition="left"
                                    placeholder={t('confirm_password')}
                                    type={viewPswd}
                                    action={{
                                        basic: true,
                                        icon: 'eye',
                                        'aria-label': t('show2'),
                                        onMouseDown: onMouseDown,
                                        onMouseUp: onMouseUp,
                                    }}
                                    onChange={onChangeInput}
                                    onBlur={onBlurPassword2}
                                />
                            </Form.Field>
                            <Button
                                fluid
                                color="teal"
                                size="large"
                                type="submit"
                                aria-label={t('sign_up')}
                                disabled={submitDisabled() || isLoading()}
                                loading={isLoading()}
                                onClick={onSignUpClick}>
                                {t('sign_up')}
                            </Button>
                        </Form>
                        {isFailed() ? <Message error>{errorMessage()}</Message> : <Divider />}
                        <Message>
                            {t('already_have_an_account')}
                            <a href="/Login/">{t('login_here')}</a>
                        </Message>
                    </Segment>
                </Container>
            ) : (
                <Container>
                    <Message positive>
                        <Message.Header>{t('your_user_registration_was_successful')}</Message.Header>
                        <p>{t('please_check_your_email_to_activate_your_account')}</p>
                    </Message>
                </Container>
            )}
        </Container>
    );
};

export default SignUp;
