export interface IToken {
    token: string;
    expires: Date;
};

export interface IUserModel<userIdType> {
    _id: userIdType;
    name: string;
    email: string;
    password: string;
    active: boolean;
    role?: string;
    verification?: IToken;
    passwordReset?: IToken;
};
