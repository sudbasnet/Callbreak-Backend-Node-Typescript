import userRegistration from './use-cases/register';
import userLogin from './use-cases/login';
import deletePermanently from './use-cases/delete-permanently';
import deactivate from './use-cases/deactivate';
import resetPassword from './use-cases/reset-password';
import verifyEmail from './use-cases/verify-email';

export default {
    userRegistration,
    userLogin,
    deactivate,
    deletePermanently,
    resetPassword,
    verifyEmail
};