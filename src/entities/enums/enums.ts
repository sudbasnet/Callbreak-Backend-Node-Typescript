export enum EUserRoles {
    ADMIN = 'admin',
    PLAYER = 'player'
};

export enum ESuits {
    SPADES = 'spades',
    HEARTS = "hearts",
    DIAMONDS = 'diamonds',
    CLUBS = "clubs"
};

export enum EFacecardValues {
    JACK = 11,
    KING = 12,
    QUEEN = 13,
    ACE = 14
};

export enum EEmailTokenType {
    PASSWORD_RESET = 'password',
    ACCOUNT_VERIFICATION = 'account'
};

export const enum gameStatus {
    "WAITING" = "waiting",
    "JOINING" = "joining",
    "ACTIVE" = "active",
    "INACTIVE" = "inactive"
};