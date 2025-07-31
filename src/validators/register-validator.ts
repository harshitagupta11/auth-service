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
    },
});
