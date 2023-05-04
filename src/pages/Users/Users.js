import './Users.css';
import { UsersDto } from './Users.model';
import { Container, Transition, Message, Icon, Image, Card } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import PageList from '../../components/PageList/PageList';
import { usePhase } from '../../Hooks/usePhase/usePhase';
import { useEffect, useRef, useContext } from 'react/cjs/react.development';
import { get } from '../../helpers/Crud';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { AuthContext } from '../../SoCs/AuthContext/AuthContext';

const Users = (props) => {
    const { t } = useTranslation();
    const { id } = useContext(AuthContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [data, setData] = useState();
    const { setPhase, phaseHandlers, isSucceed, isFailed } = usePhase();
    const dto = { ...UsersDto(), ...Object.fromEntries(searchParams) };

    //NOTE: both useCallback and useRef here can manage the page reload correctly
    const loadUsers = useCallback(() => {
        get('/api/1.0/users', dto, {
            ...phaseHandlers,
            succeed: (res) => {
                //NOTE: with react 18, multiple setters will only trigger one render
                //taking advantage of multi-set single-render new feature
                setPhase('server_succeed');
                setData(res.data);
            },
        });
    }, [dto.page, dto.size]);
    //const didMount = useRef({});
    useEffect(() => {
        loadUsers();
        // if (dto.page !== didMount.current.page || dto.size !== didMount.current.size) {
        //     didMount.current = dto;

        // }
    }, [loadUsers]);
    const onChange = ({ pos }) => {
        setSearchParams({ ...searchParams, page: pos });
    };
    const onClick = (evt) => {
        if (evt.id === id) {
            navigate(`../Profile`);
        } else {
            navigate(`${evt.id}`);
        }
    };
    const content = (data && data.content) ?? [];
    const { page, size, totalPages } = data ?? {};
    const hasData = content && totalPages;
    //console.log(`--------------> phase:${phase} len:${content.length} t:` + Date.now());

    //NOTE: Semantic UI Transition doesn't work with <></> or custom tags properly.
    //It works properly with Container under it.
    return (
        <Container className="Users" aria-label={t('users_page')}>
            <Transition.Group animation="fade" duration={200}>
                {isSucceed() && hasData && (
                    <Container className="cards">
                        {content.map(({ id, username, email, image }) => (
                            <Card key={id} size="small">
                                <Image
                                    as="a"
                                    onClick={(evt) => onClick({ ...evt, id })}
                                    src={'/avatars/' + (image ?? 'person1.jpg')}
                                />
                                <Card.Content as="a" onClick={(evt) => onClick({ ...evt, id })}>
                                    <Card.Header>{username}</Card.Header>
                                    <Card.Meta>
                                        <span className="date">#{id}</span>
                                    </Card.Meta>
                                    <Card.Description>
                                        This is {username} with id {id}
                                    </Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    <span>
                                        <Icon name="mail" />
                                        {email}
                                    </span>
                                </Card.Content>
                            </Card>
                        ))}
                        <PageList
                            totalPages={totalPages}
                            currentPosition={page}
                            displayWidth={size}
                            onChange={onChange}
                        />
                    </Container>
                )}
            </Transition.Group>
            {isSucceed() && !hasData && (
                <Container textAlign="center">
                    <Message icon>
                        <Icon name="file outline" loading />
                        <Message.Content>{t('no_data')}</Message.Content>
                    </Message>
                </Container>
            )}
            {isFailed() && (
                <Container textAlign="center">
                    <Message icon>
                        <Icon name="broken chain" loading />
                        <Message.Content>{t('service_failure')}</Message.Content>
                    </Message>
                </Container>
            )}
        </Container>
    );
};
export default Users;
