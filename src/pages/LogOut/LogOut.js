import "./LogOut.css";
import { Container } from "semantic-ui-react";
import { useTranslation } from "react-i18next";

const LogOut = (props) => {
    const { t } = useTranslation();
    return (
        <Container aria-label={t("logout_page")} textAlign="center">
            <h2>This is the log out page</h2>
        </Container>
    );
};
export default LogOut;
