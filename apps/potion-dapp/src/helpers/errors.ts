export class ContractInitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContractInitError";
  }
}
