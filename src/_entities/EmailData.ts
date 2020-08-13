export default interface EmailData {
    sender: string;
    recipientId: string;
    recipientEmail?: string;
    subject: string;
    htmlBody: string;
    link?: string;
    linkText?: string;
    tokenType?: TokenType;
};

export enum TokenType { PASSWORD_RESET = 'password', ACCOUNT_VERIFICATION = 'account' };