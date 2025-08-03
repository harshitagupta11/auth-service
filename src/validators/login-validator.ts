import { checkSchema } from 'express-validator';

export default checkSchema({
    email: {
        notEmpty: {
            errorMessage: 'Email is required!',
            bail: true,
        },
        isEmail: {
            errorMessage: 'Invalid email address!',
        },
        trim: true,
    },

    password: {
        notEmpty: {
            errorMessage: 'Password is required!',
            bail: true,
        },
        trim: true,
    },
});
