import { EEmailTokenType } from "../enums/enums";

export default interface IEmailData {
    sender: string;
    recipientId: string;
    recipientEmail?: string;
    subject: string;
    htmlBody: string;
    link?: string;
    linkText?: string;
    tokenType?: EEmailTokenType;
};

