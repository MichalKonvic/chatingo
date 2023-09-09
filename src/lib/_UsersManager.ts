import { Socket } from "socket.io";
import cache from '@/lib/cache'
export interface ISocketUser {
    socket: Socket,
    userEmail: string
}
export class UsersManager {
    /**
     * Inits cache if cache has no cacheKey
     */
    private static readonly cacheKey = "connected-users"
    private static cacheCheck() {
        if (cache.has(this.cacheKey)) return;
        cache.set<ISocketUser[]>(this.cacheKey, []);
    }
    static addUserConnection(email: string, socket: Socket) {
        this.users.push({
            userEmail: email,
            socket
        });
        return this.users.length;
    }
    static isUserConnected(email: string) {
        return this.users.some(u => u.userEmail == email);
    }
    static removeUserConnections(email: string) {
        this.users = this.users.filter(u => u.userEmail !== email);
        return this.users.length
    }
    static removeUserConnection(socket: Socket) {
        this.users = this.users.filter(u => u.socket.id !== socket.id)
        return this.users.length;
    }
    /**
     * ! CAN RETURN CLOSED CONNECTIONS
     * ! that hapens beacuse socket.io send ping packets 
     * ! every 2s(pingInterval) but timeout is 20s(pingTimeout) so closed connection
     * ! is recognized after 22s
     * @param email User identifier
     * @returns All user connections
     */
    static getUserConnections(email: string) {
        return this.users.filter(u => u.userEmail === email);
    }
    public static get users(): ISocketUser[] {
        this.cacheCheck();
        return cache.get<ISocketUser[]>(this.cacheKey)!;
    }

    public static set users(users: ISocketUser[]) {
        cache.set<ISocketUser[]>(this.cacheKey, users);
    }


}