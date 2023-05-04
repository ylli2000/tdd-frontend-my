import axios from 'axios';
import i18n from '../locale/i18n';
import env from '../env';

const config = {
    headers: {
        'Accept-Language': i18n.language,
    },
};
const send = async (afn, { before, succeed, rejected, internal, final }) => {
    try {
        before && before();
        const res = await afn();
        succeed && succeed(res);
        return res;
    } catch (err) {
        const status = (err && err.response && err.response.status) ?? 0;
        const data = (err && err.response && err.response.data) ?? '';
        if (status >= 400 && status <= 499 && data) {
            rejected && rejected(data);
        } else {
            console.log(err); //seems like coding issue, print it
            internal && internal(err);
        }
        return err;
    } finally {
        final && final();
    }
};
const toUrl = (path, params = {}) => {
    //const dummy = !path.startsWith('http') ? 'http://dummy-url.com' : '';
    var url = new URL(path || '', env.SERVER_API_URL);
    url.port = env.SERVER_API_PORT;
    Object.keys(params).forEach((key) => {
        if (url.searchParams.has(key)) {
            url.searchParams.set(key, params[key]);
        } else {
            url.searchParams.append(key, params[key]);
        }
    });
    return url.toString(); //.replace(dummy, '');
};
export const get = async (path, dto, cbs) => send(() => axios.get(toUrl(path, dto), config), cbs);
export const post = async (path, dto, cbs) => send(() => axios.post(toUrl(path), dto, config), cbs);

// fetch('/api/1.0/users', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//         username, email, password
//     })
// });
