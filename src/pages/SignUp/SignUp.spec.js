import SignUp from './SignUp';
import FlagList from '../../components/FlagList/FlagList.js';
import { fireEvent, render, waitFor, act } from '@testing-library/react';
import screen from '../../helpers/Test';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import i18n, { initI18n } from '../../locale/i18n';
import en from '../../locale/en';
import cn from '../../locale/cn';
/*
NOTE: Test Sign Up

visit: https://testing-library.com/docs/dom-testing-library/cheatsheet/

render: renders the jsx compoment, and return a result. Inside there is 
        a {container} you can call .querySelector(...) but not recommanded 
        to use.

screen: provides all functions like queryBy...(), getBy...(), findBy...()

userEvent: provides all simulations like type(), click(), dblClick()...

describe:  from jest library. Some available events are:
beforeEach, beforeAll, afterEach, afterAll
it:  from jest library.
expect: from jest library.

await waitFor: use when something is originally there, after async process
this thing is gone. e.g. sign up form is gone, show check email box. 

About escalating server by doing server.use():
if you call server.use(
    rest.post('/api/1.0/users', (req, res, ctx) => {

        to use a special post in a particular test, then you have to do:
        return res.once( ... //run once only, back to default server

            or, we can override handler: 
beforeEach(()=> {
    server.resetHandler();  //reset to default server


*/
initI18n();
describe('Sgin Up Page', () => {
    beforeEach(async () => {
        serviceCallback = () => {};
        serviceResponse = (res, ctx) => expectOK(res, ctx);
        await act(() => i18n.changeLanguage('en'));
    });
    afterEach(() => {});
    beforeAll(() => server.listen());
    afterAll(() => server.close());

    describe('Interaction', () => {
        it('disables the button initially', () => {
            const { el5 } = setupBlanks();
            expect(el5).toBeDisabled();
        });
        it('enables the button when new password and confirm password are matched', () => {
            const { el5 } = setupInputs();
            expect(el5).toBeEnabled();
        });
        it('shows password when show password button is pressed', () => {
            const { el3, el4 } = setupInputs();
            const showbtn = screen.getByRole('button', { name: en.show }); //or regex is /show\b/i
            fireEvent.mouseDown(showbtn);
            expect(el3).toHaveAttribute('type', 'text');
            expect(el4).toHaveAttribute('type', 'text');
        });
        // it('sends sign up to backend when clicking button (axios specific)', () => {
        //     const {el5} = setupInputs();

        //     //take over the actual post
        //     const mockFn = jest.fn();
        //     axios.post = mockFn;

        //     //click sign up button
        //     userEvent.click(el5);

        //     //we can mock many calls, now only take the first one
        //     const firstCallOfMockFn = mockFn.mock.calls[0];
        //     const body = firstCallOfMockFn[1]; //2nd param of axios.post
        //     expect(url).toEqual('http://localhost:9876/api/1.0/users');
        //     expect(body).toEqual({
        //         username: 'user1',
        //         email: 'user1@email.com',
        //         password: '123Abc#@'
        //     });
        // });

        it('sends sign up to backend when clicking button (msw generic)', async () => {
            //do not enable the axio specific above, or mockFn will take over
            //and msw server is not going to work
            const { el5 } = setupInputs();
            let serverReceived; //setup msw server callback
            serviceCallback = (req) => (serverReceived = req.body);
            userEvent.click(el5); //click sign up button
            await waitFor(() => {
                expect(serverReceived).toEqual({
                    username: 'user1',
                    email: 'user1@email.com',
                    password: '123Abc#@',
                    //sending to server, password2 not needed
                });
            });
        });
        it('debounces sign up button while waiting for response', async () => {
            const { el5 } = setupInputs();
            let counter = 0; //setup msw server callback
            serviceCallback = () => (counter += 1);
            userEvent.click(el5);
            userEvent.click(el5); //click sign up button twice
            await waitFor(() => {
                expect(counter).toBe(1);
            });
        });
        it('displays account activation nofitication after successfully signed up', async () => {
            const { el5 } = setupInputs();
            userEvent.click(el5); //click sign up button
            const el = await screen.findByText(en.please_check_your_email_to_activate_your_account);
            expect(el).toBeInTheDocument();
        });
        it('hides sign up form after successfully signed up', async () => {
            const { el0, el5 } = setupInputs();
            userEvent.click(el5); //click sign up button
            await waitFor(() => {
                expect(el0).not.toBeInTheDocument();
            });
        });
        it('reneables sign up button and hide spinner upon server failed', async () => {
            const { el5 } = setupInputs();
            serviceResponse = expectServerValidationFail('email', en.email_inuse);
            userEvent.click(el5); //click sign up button
            expect(el5).toHaveClass('loading');
            expect(el5).toBeDisabled();
            await waitFor(() => {
                expect(el5).toBeEnabled();
            });
            expect(el5).not.toHaveClass('loading');
        });
        it('displays server validation error', async () => {
            const { el5 } = setupInputs();
            serviceResponse = expectServerValidationFail('email', en.email_inuse);
            userEvent.click(el5); //click sign up button
            const el = await screen.findByText(en.email_inuse);
            expect(el).toBeInTheDocument();
        });
        it.each`
            field         | input   | message
            ${'username'} | ${null} | ${en.username_size}
            ${'email'}    | ${null} | ${en.email_invalid}
        `('displays client validation: $message; $field=$input', ({ field, input, message }) => {
            const { el5 } = setupInputs({
                [field]: input,
                passwrod: '123Abc#@',
                password2: '123Abc#@',
            });
            userEvent.click(el5); //click sign up button
            const el11 = screen.getByText(message);
            expect(el11).toBeInTheDocument();
        });
        it.each`
            password     | message
            ${'abc'}     | ${en.password_size}
            ${'abcdefg'} | ${en.password_pattern}
        `('displays client validation: $message; password=$password', ({ password, message }) => {
            const { el5 } = setupInputs({
                passwrod: password,
                password2: password,
            });
            userEvent.click(el5); //click sign up button
            const el11 = screen.getByText(message);
            expect(el11).toBeInTheDocument();
        });
    });
    describe('internationalisation', () => {
        it('initially displays sign up in English', () => {
            const { el5 } = setupBlanks();
            const el = screen.queryByRole('button', { name: en.sign_up });
            expect(el5).toBeInTheDocument();
            expect(el).toBeInTheDocument();
        });
        it('displays sign up in Chinese after changing the language', async () => {
            const { el9 } = setupBlanks();
            userEvent.click(el9);
            const el = await screen.findByRole('button', { name: cn.sign_up });
            expect(el).toBeInTheDocument();
        });
        it('sends accept language header as en for outgoing request', async () => {
            const { el5 } = setupInputs();
            userEvent.click(el5);
            const el = await screen.findByText(en.your_user_registration_was_successful);
            expect(el).toBeInTheDocument();
            expect(acceptLanguageHeader).toBe('en');
        });
    });
});

const setupBlanks = (lang = en) => {
    render(
        <>
            <SignUp />
            <FlagList />
        </>
    );
    const el0 = screen.queryByText(lang['sign_up_for_an_account']);
    const el1 = screen.queryByPlaceholderText(lang['new_username']);
    const el2 = screen.queryByPlaceholderText(lang['new_email']);
    const el3 = screen.queryByPlaceholderText(lang['new_password']);
    const el4 = screen.queryByPlaceholderText(lang['confirm_password']);
    const el5 = screen.queryByRole('button', { name: lang['sign_up'] });
    const el6 = screen.queryByTextContent(lang['already_have_an_account'] + lang['login_here']);
    const el7 = screen.queryByText(lang['login_here']);
    const el8 = screen.queryByAltText('en');
    const el9 = screen.queryByAltText('cn');
    expect(el0).toBeInTheDocument();
    expect(el1).toBeInTheDocument();
    expect(el2).toBeInTheDocument();
    expect(el3).toBeInTheDocument();
    expect(el4).toBeInTheDocument();
    expect(el5).toBeInTheDocument();
    expect(el6).toBeInTheDocument();
    expect(el7).toBeInTheDocument();
    expect(el8).toBeInTheDocument();
    expect(el9).toBeInTheDocument();
    return { el0, el1, el2, el3, el4, el5, el6, el7, el8, el9 };
};
const setupInputs = (
    opts = {
        username: 'user1',
        email: 'user1@email.com',
        passwrod: '123Abc#@',
        password2: '123Abc#@',
    },
    lang = en
) => {
    const { el0, el1, el2, el3, el4, el5, el6, el7, el8, el9 } = setupBlanks(lang);
    if (opts.username) userEvent.type(el1, opts.username);
    if (opts.email) userEvent.type(el2, opts.email);
    if (opts.passwrod) userEvent.type(el3, opts.passwrod);
    if (opts.password2) userEvent.type(el4, opts.password2);
    return { el0, el1, el2, el3, el4, el5, el6, el7, el8, el9 };
};

const expectServerValidationFail = (field, message) => {
    return (res, ctx) => {
        return res(
            ctx.status(400),
            ctx.json({
                message: 'Validation Failure',
                validationErrors: {
                    [field]: message,
                },
            })
        );
    };
};
const expectOK = (res, ctx) => res(ctx.status(200));
let serviceCallback = () => {};
let serviceResponse = expectOK;
let acceptLanguageHeader = null;
const server = setupServer(
    rest.post('/api/1.0/users', (req, res, ctx) => {
        serviceCallback && serviceCallback(req, res, ctx);
        acceptLanguageHeader = req.headers.get('Accept-Language');
        return serviceResponse(res, ctx);
    })
);
