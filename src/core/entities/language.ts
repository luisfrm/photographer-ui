export class Language {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly name: string
  ) {}

  validate(): void {
    if (this.code.length !== 2) {
      throw new Error('Language code must be 2 characters long');
    }
  }
}