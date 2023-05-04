import './PageNotFound.css';
import { Container, Segment, Header } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';

const PageNotFound = () => {
    const { t } = useTranslation();
    return (
        <Container className="PageNotFound" aria-label={t('page_not_found')}>
            <Segment circular inverted>
                <Header as="h1" inverted>
                    404
                    <Header.Subheader>{t('page_not_found')}</Header.Subheader>
                </Header>
            </Segment>
        </Container>
    );
};

export default PageNotFound;
