import { Model } from 'mongoose';
export interface TCar {
  name: string;
  description: string;
  color: string;
  isElectric: boolean;
  features: string[];
  pricePerHour: number;
  status?: 'available' | 'not-available';
  isDeleted: boolean;
}

export interface TCarStatics extends Model<TCar> {
  isCarExistByID(id: string): Promise<TCar>;
  isCarAvailableByID(id: string): Promise<TCar>;
}
