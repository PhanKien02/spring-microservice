export type UserStatus = 'online' | 'offline' | 'away';

export interface User {
        id: string;
        fullName: string;
        userName: string;
        email: string;
        avatar: string;
        status: UserStatus;
        bio?: string;
}
