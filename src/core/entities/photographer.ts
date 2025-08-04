export class Photographer {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public phone: string,
    public address: string,
    public city: string,
    public state: string,
    public country: string,
    public logoUrl: string,
    public websiteUrl: string,
    public createdAt: string,
    public updatedAt: string,
  ) {}

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  };

  get fullAddress(): string {
    return `${this.address}, ${this.city}, ${this.state}, ${this.country}`;
  };

  get fullContact(): string {
    return `${this.phone} - ${this.email}`;
  };
}