export class Profile {
  private id: number;
  private name: string;
  private age: number;
  private sex: string;
  private likes: any[]; // ProfileLike[] - simplified for now
  private profilePictureUrl: string;

  constructor(
    id: number,
    name: string,
    age: number,
    sex: string,
    likes: any[],
    profilePictureUrl: string
  ) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.sex = sex;
    this.likes = likes;
    this.profilePictureUrl = profilePictureUrl;
  }

  // Getters and setters
  getId(): number {
    return this.id;
  }

  setId(id: number): void {
    this.id = id;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
  }

  getAge(): number {
    return this.age;
  }

  setAge(age: number): void {
    this.age = age;
  }

  getSex(): string {
    return this.sex;
  }

  setSex(sex: string): void {
    this.sex = sex;
  }

  getLikes(): any[] {
    return this.likes;
  }

  setLikes(likes: any[]): void {
    this.likes = likes;
  }

  getProfilePictureUrl(): string {
    return this.profilePictureUrl;
  }

  setProfilePictureUrl(profilePictureUrl: string): void {
    this.profilePictureUrl = profilePictureUrl;
  }
}

export class User {
  public id: number;
  public name: string;
  public email: string;
  public mobileNumber: string;
  public address: string;
  public pincode: string;
  public profilePictureUrl: string;
  public creationDate: Date;
  public age: number;
  public sex: string;
  public username: string;
  public state: string;
  public city: string;
  public profiles: Profile[];

  constructor(
    id: number,
    name: string,
    email: string,
    mobileNumber: string,
    address: string,
    pincode: string,
    profilePictureUrl: string,
    creationDate: Date,
    age: number,
    sex: string,
    profiles: Profile[],
    username: string = '',
    state: string = '',
    city: string = ''
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.mobileNumber = mobileNumber;
    this.address = address;
    this.pincode = pincode;
    this.profilePictureUrl = profilePictureUrl;
    this.creationDate = creationDate;
    this.age = age;
    this.sex = sex;
    this.profiles = profiles;
    this.username = username;
    this.state = state;
    this.city = city;
  }

  // Getters and setters
  getId(): number {
    return this.id;
  }

  setId(id: number): void {
    this.id = id;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
  }

  getEmail(): string {
    return this.email;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  getMobileNumber(): string {
    return this.mobileNumber;
  }

  setMobileNumber(mobileNumber: string): void {
    this.mobileNumber = mobileNumber;
  }

  getAddress(): string {
    return this.address;
  }

  setAddress(address: string): void {
    this.address = address;
  }

  getPincode(): string {
    return this.pincode;
  }

  setPincode(pincode: string): void {
    this.pincode = pincode;
  }

  getProfilePictureUrl(): string {
    return this.profilePictureUrl;
  }

  setProfilePictureUrl(profilePictureUrl: string): void {
    this.profilePictureUrl = profilePictureUrl;
  }

  getCreationDate(): Date {
    return this.creationDate;
  }

  setCreationDate(creationDate: Date): void {
    this.creationDate = creationDate;
  }

  getAge(): number {
    return this.age;
  }

  setAge(age: number): void {
    this.age = age;
  }

  getSex(): string {
    return this.sex;
  }

  setSex(sex: string): void {
    this.sex = sex;
  }

  getProfiles(): Profile[] {
    return this.profiles;
  }

  setProfiles(profiles: Profile[]): void {
    this.profiles = profiles;
  }
}

export interface Order {
  id: string;
  orderNumber: string;
  orderDate: Date;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: any;
  invoiceUrl?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  packagingType?: string;
} 