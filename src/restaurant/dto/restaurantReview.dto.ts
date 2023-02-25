export class RestaurantReviewDto {
  restaurantId: any;
  reviewObject: {
    _id: any;
    userId: any;
    reviewText: string;
    rating: number;
  };
}
