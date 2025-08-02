import { ProfileLikeType } from "./profile-like-type";

export class ProfileLike {
    private id: number;
    private type: ProfileLikeType;
  
    constructor(id: number, type: ProfileLikeType) {
      this.id = id;
      this.type = type;
    }
  
    // Getters and setters
  
    getId(): number {
      return this.id;
    }
  
    setId(id: number): void {
      this.id = id;
    }
  
    getType(): ProfileLikeType {
      return this.type;
    }
  
    setType(type: ProfileLikeType): void {
      this.type = type;
    }
  } 