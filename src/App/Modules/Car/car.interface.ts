import { Model } from 'mongoose';
export interface TCar {
  toObject : ()=>TCar;
  _id: string;
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
  availableForTheDateEntered?: string;
}

export interface TCarStatics extends Model<TCar> {
  isCarExistByID(id: string): Promise<TCar>;
  isCarAvailableByID(id: string): Promise<TCar>;
}
