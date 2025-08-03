import { ProfileLike } from './profile-like';

export class Profile {
  private id: number;
 
  private name: string;
  private age: number;
  private sex: string;
  private likes: ProfileLike[];
  private profilePictureUrl: string;

  constructor(
    id: number,

    name: string,
    age: number,
    sex: string,
    likes: ProfileLike[],
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

  getLikes(): ProfileLike[] {
    return this.likes;
  }

  setLikes(likes: ProfileLike[]): void {
    this.likes = likes;
  }

  getProfilePictureUrl(): string {
    return this.profilePictureUrl;
  }

  setProfilePictureUrl(profilePictureUrl: string): void {
    this.profilePictureUrl = profilePictureUrl;
  }
}
