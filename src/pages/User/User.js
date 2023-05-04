import './User.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef } from 'react/cjs/react.development';
import { get } from '../../helpers/Crud';
import { usePhase } from '../../Hooks/usePhase/usePhase';
import {
    Container,
    Image,
    Icon,
    Divider,
    Label,
    Grid,
    Segment,
    Button,
    Input,
    Message,
    Transition,
} from 'semantic-ui-react';
import { useState } from 'react';
//import { useTranslation } from 'react-i18next';

const User = () => {
    //const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(id);
    const { setPhase, phaseHandlers, isSucceed, isFailed, errorMessage } = usePhase();
    const didMount = useRef({});
    useEffect(() => {
        if (id !== didMount.current) {
            didMount.current = id;
            get(
                `/api/1.0/users/${id}`,
                {},
                {
                    ...phaseHandlers,
                    succeed: (res) => {
                        //NOTE: with react 18, multiple setters will only trigger one render
                        //taking advantage of multi-set single-render new feature
                        setPhase('server_succeed');
                        setData(res.data);
                    },
                }
            );
        }
    });
    const onBack = (evt) => {
        navigate(-1);
    };
    const onActivate = (evt) => {};
    const onDeactivate = (evt) => {};
    const onChangePassword = (evt) => {};
    const onDelete = (evt) => {};
    const { username, email, image } = data;
    return (
        <Container className="User">
            <Button onClick={onBack} basic circular icon inverted>
                <Icon aria-label="back" name="arrow left" size="big" />
            </Button>
            <Transition.Group animation="fade" duration={200}>
                {isSucceed() && (
                    <Container className="info">
                        <Image src={`/avatars/${image || 'blank.png'}`} size="small" circular />
                        <h2 className="username">{username}</h2>
                        <Divider />
                        <Label className="label user-id">
                            <Icon name="user" />#{id}
                        </Label>
                        <Label className="label email">
                            <Icon name="mail" />
                            {email}
                        </Label>

                        <Grid>
                            <Segment attached="top" inverted>
                                <p>Disable the account so that the user cannot access this portal any more.</p>
                            </Segment>
                            <Button.Group attached="bottom">
                                <Button content="Activate" onClick={onActivate} color="blue" />
                                <Button.Or text="Or" />
                                <Button content="Deactivate" onClick={onDeactivate} />
                            </Button.Group>
                        </Grid>

                        <Grid>
                            <Segment attached="top" inverted>
                                <p>Change the account password for this user manually.</p>
                                <Input placeholder="new password..." size="mini" />
                            </Segment>
                            <Button attached="bottom" content="Change" onClick={onChangePassword} />
                        </Grid>

                        <Grid>
                            <Segment attached="top" inverted>
                                <p>Delete this the account permanently. Caution, this action cannot be undo.</p>
                            </Segment>
                            <Button attached="bottom" color="brown" content="Delete" onClick={onDelete} />
                        </Grid>
                    </Container>
                )}
            </Transition.Group>
            {isFailed() && (
                <Container textAlign="center">
                    <Message icon>
                        <Icon name="broken chain" />
                        {errorMessage()}
                    </Message>
                </Container>
            )}
        </Container>
    );
};

export default User;
