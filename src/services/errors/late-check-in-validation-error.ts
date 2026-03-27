export class LateCheckInValidationError extends Error {
  constructor() {
    super('The limit time of check in was exceeded (20 minutes)')
  }
}
