import './Home.css';
import { Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const Home = (props) => {
    const { t } = useTranslation();
    return <Container aria-label={t('home_page')} textAlign='center'>
        <h2>This is the home page</h2>
        <p>You can <Link to="/SignUp">sign up here</Link></p>
    </Container>
};
export default Home;
