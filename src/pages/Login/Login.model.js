//data mounting models
export const InputsDmo = () => ({
    email: '',
    password: '',
});
export const PhaseDmo = (phase) => ({
    phase: phase ?? '',
    message: '',
    errors: {}, // this comes from server, if any
});
//data transfer models
export const loginDto = (inputsDmo) => ({
    email: inputsDmo.email,
    password: inputsDmo.password, //same or hash it?
});
export const userDto = () => ({
    id: '',
    username: '',
    image: '',
    token: '',
});
