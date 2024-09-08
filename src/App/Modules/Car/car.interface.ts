import { Model } from 'mongoose';
export interface TCar {
  name: string;
  model: string;
  year: string;
  carType: string;
  description: string;
  color: string;
  features: string[];
  images: { url: string; blurHash: string }[];
  pricePerHour: string;
  pricePerDay: string;
  status?: 'available' | 'not-available';
  isDeleted: boolean;
}

export interface TCarStatics extends Model<TCar> {
  isCarExistByID(id: string): Promise<TCar>;
  isCarAvailableByID(id: string): Promise<TCar>;
}
