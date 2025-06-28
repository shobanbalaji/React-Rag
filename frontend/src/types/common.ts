export type Optional<T> = T | null | undefined;
export type UserCred = {
    email: string;
    userName: string;
    _id: string;
}
export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';
