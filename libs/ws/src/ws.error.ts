export class WsError extends Error {
  constructor(
    public readonly event: string,
    public readonly message: string,
  ) {
    super(message);
    this.name = 'WsError';
  }
}
