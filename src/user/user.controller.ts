import userRegistration from './use-cases/register';
import userLogin from './use-cases/login';
import deletePermanently from './use-cases/delete-permanently';
import deactivate from './use-cases/deactivate';
import resetPassword from './use-cases/reset-password';
import verifyEmail from './use-cases/verify-email';
import requestPasswordReset from './use-cases/request-password-reset';
import requestVerificationEmail from './use-cases/request-verification-email';
import updatePassword from './use-cases/update-password';
import registerGuest from './use-cases/register-guest';

export default {
    userRegistration,
    userLogin,
    deactivate,
    deletePermanently,
    resetPassword,
    verifyEmail,
    requestPasswordReset,
    requestVerificationEmail,
    updatePassword,
    registerGuest
};