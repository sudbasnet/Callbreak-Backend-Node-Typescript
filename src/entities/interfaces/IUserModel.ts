export interface IToken {
    token: string;
    expires: Date;
};

export interface IPlayerStats {
    totalGames: number;
    totalFirstPosition: number;
    totalSecondPosition: number;
    totalThirdPostion: number;
    mostRecentGameId: {
        players: string[],
        gameId: string
    };
    friends: string[];
}

export interface IUserModel<userIdType> {
    _id: userIdType;
    name: string;
    email: string;
    password: string;
    active: boolean;
    role?: string;
    jwt?: IToken;
    verification?: IToken;
    passwordReset?: IToken;
};
