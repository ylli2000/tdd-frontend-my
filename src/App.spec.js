import { render, act } from '@testing-library/react';
import screen from './helpers/Test';
import i18n, { initI18n } from './locale/i18n';
import en from './locale/en';
import App from './App';

initI18n();
describe('Routing', () => {
    beforeEach(async () => {
        await act(() => i18n.changeLanguage('en'));
    });

    it.each`
        pageName          | path
        ${'home_page'}    | ${'/'}
        ${'home_page'}    | ${'/Home'}
        ${'sign_up_page'} | ${'/SignUp'}
        ${'login_page'}   | ${'/Login'}
        ${'logout_page'}  | ${'/Logout'}
        ${'profile_page'} | ${'/Profile'}
        ${'users_page'}   | ${'/Users'}
    `('displays $pageName when navigated to $path', ({ pageName, path }) => {
        window.history.pushState({}, '', path);
        render(<App />); //App renders according to path
        //NOTE: use `queryBy` if the element may not be on the page
        //using `getBy` will throw an exception and test will fail
        const page = screen.getByLabelText(en[pageName]);
        expect(page).toBeInTheDocument();
    });
});
