import { checkSchema } from 'express-validator';

// export default [
//     body('email').notEmpty().withMessage('Email is required!'),
//     body('firstName').notEmpty().withMessage('First Name is required!'),
//     body('password').notEmpty().withMessage('Password is required!'),
// ];

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
    firstName: {
        notEmpty: {
            errorMessage: 'First Name is required!',
        },
        trim: true,
    },
    password: {
        notEmpty: {
            errorMessage: 'Password is required!',
            bail: true,
        },
        isLength: {
            options: { min: 8 },
            errorMessage: 'Password length should be at least 8 chars!',
        },
        trim: true,
    },
});
