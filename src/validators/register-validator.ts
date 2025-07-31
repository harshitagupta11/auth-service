import { checkSchema } from 'express-validator';

// export default [
//     body('email').notEmpty().withMessage('Email is required!'),
//     body('firstName').notEmpty().withMessage('First Name is required!'),
//     body('password').notEmpty().withMessage('Password is required!'),
// ];

export default checkSchema({
    email: {
        errorMessage: 'Email is required!',
        notEmpty: true,
        trim: true,
        isEmail: true,
    },
    firstName: {
        errorMessage: 'First Name is required!',
        notEmpty: true,
        trim: true,
    },
    password: {
        errorMessage: 'Password is required!',
        notEmpty: true,
        trim: true,
        isLength: {
            options: {
                min: 8,
            },
            errorMessage: 'Password length should be at least 8 chars!',
        },
    },
});
