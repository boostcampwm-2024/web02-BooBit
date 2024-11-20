export interface AccountService {
  createAccount(accountRequest: { userId: string }): Promise<{ status: string }>;
}
