import { getDatabase } from '../database/db';
import { UserProfileData } from '../../presentation/store/useStore';

export const UserRepository = {
  async getProfile(): Promise<UserProfileData | null> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<UserProfileData>(
      'SELECT * FROM UserProfile ORDER BY id DESC LIMIT 1'
    );
    return result || null;
  },

  async saveProfile(profile: UserProfileData): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO UserProfile (startDate, cigsPerDay, cigsPerPack, pricePerPack, yearsSmoking) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        profile.startDate as string,
        profile.cigsPerDay,
        profile.cigsPerPack,
        profile.pricePerPack,
        profile.yearsSmoking
      ]
    );
  },
  
  async updateProfile(profile: UserProfileData): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE UserProfile SET 
        startDate = ?, 
        cigsPerDay = ?, 
        cigsPerPack = ?, 
        pricePerPack = ?, 
        yearsSmoking = ? 
       WHERE id = (SELECT id FROM UserProfile ORDER BY id DESC LIMIT 1)`,
      [
        profile.startDate as string,
        profile.cigsPerDay,
        profile.cigsPerPack,
        profile.pricePerPack,
        profile.yearsSmoking
      ]
    );
  }
};
