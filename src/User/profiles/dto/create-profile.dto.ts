export class CreateProfileDto {
  bio: string;
  accountType: { type: string; enum: ['public', 'private']; default: 'public' };
  accountHolderType: {
    type: string;
    enum: ['student', 'nonStudent'];
    default: 'nonStudent';
  };
  links: [string];
  isStudentAccount: {
    type: boolean;
    default: false;
  };
  answers: [string];
  favoriteCuisine: [string];
  favoriteChef: [string];
  dieRequirement: [string];
  profileImage: {
    fileName: string;
    filePath: string;
  };

  // location: {
  //   type: string;
  //   coordinates: number[];
  // };
}
