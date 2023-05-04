import './Profile.css';
import { Container } from 'semantic-ui-react';
import { useTranslation } from "react-i18next";

const Profile = (props) => {
    const { t } = useTranslation();
    return (
        <Container aria-label={t('profile_page')} textAlign='center'>
            <h2>This is the profile page</h2>
        </Container>
    );
};
export default Profile;
