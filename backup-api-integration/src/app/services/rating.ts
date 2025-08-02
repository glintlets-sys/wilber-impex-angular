export class Rating {
    id: number;
    rating: number;
    comment?: string;
    toyId: number;
    user: string;
    creationDate: Date;
    title?:string;
    imageUrls?:String[];
  
    constructor(
      id: number,
      rating: number,
      comment: string,
      toyId: number,
      user: string,
      creationDate: Date
    ) {
      this.id = id;
      this.rating = rating;
      this.comment = comment;
      this.toyId = toyId;
      this.user = user;
      this.creationDate = creationDate;
    }
  }
  