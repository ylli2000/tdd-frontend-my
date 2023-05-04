//data mounting models
export const InputsDmo = () => ({
    username: '',
    email: '',
    password: '',
    password2: '',
});
//data transfer models
export const signUpDto = (inputsDmo) => ({
    email: inputsDmo.email,
    username: inputsDmo.username,
    password: inputsDmo.password,
});
