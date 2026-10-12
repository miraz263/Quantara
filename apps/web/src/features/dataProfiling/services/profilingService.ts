import {
  DatasetProfile,
  VariableProfile,
  MissingProfile,
  OutlierProfile,
  DuplicateProfile,
  ProfileSnapshot,
} from '../types/profilingTypes';
import {
  MOCK_DATASET_PROFILE,
  MOCK_VARIABLE_PROFILES,
  MOCK_MISSING_PROFILE,
  MOCK_OUTLIER_PROFILE,
  MOCK_DUPLICATE_PROFILE,
} from '../mocks/mockProfilingData';

let activeProfileStore: DatasetProfile = { ...MOCK_DATASET_PROFILE };
let variableProfilesStore: VariableProfile[] = [...MOCK_VARIABLE_PROFILES];

export class ProfilingService {
  static async getProfile(datasetId?: string): Promise<DatasetProfile> {
    await new Promise((res) => setTimeout(res, 30));
    return { ...activeProfileStore };
  }

  static async getVariableProfiles(datasetId?: string): Promise<VariableProfile[]> {
    await new Promise((res) => setTimeout(res, 30));
    return [...variableProfilesStore];
  }

  static async getVariableProfile(datasetId: string, variableId: string): Promise<VariableProfile | null> {
    await new Promise((res) => setTimeout(res, 20));
    const found = variableProfilesStore.find((v) => v.id === variableId || v.name === variableId);
    return found ? { ...found } : null;
  }

  static async getMissingProfile(datasetId?: string): Promise<MissingProfile> {
    await new Promise((res) => setTimeout(res, 30));
    return { ...MOCK_MISSING_PROFILE };
  }

  static async getOutlierProfile(datasetId?: string): Promise<OutlierProfile> {
    await new Promise((res) => setTimeout(res, 30));
    return { ...MOCK_OUTLIER_PROFILE };
  }

  static async getDuplicateProfile(datasetId?: string): Promise<DuplicateProfile> {
    await new Promise((res) => setTimeout(res, 30));
    return { ...MOCK_DUPLICATE_PROFILE };
  }

  static async refreshProfile(datasetId?: string): Promise<ProfileSnapshot> {
    await new Promise((res) => setTimeout(res, 120));
    const now = new Date().toISOString();
    activeProfileStore.lastProfiledAt = now;
    
    return {
      id: `snap-${Date.now()}`,
      datasetId: datasetId || 'ds-001',
      datasetVersion: activeProfileStore.datasetVersion,
      createdAt: now,
      qualityScore: activeProfileStore.qualityScore.overall,
      rowCount: activeProfileStore.rowCount,
      columnCount: activeProfileStore.columnCount,
      missingPercentage: activeProfileStore.missingPercentage,
      duplicateCount: activeProfileStore.duplicateRowsCount,
      outlierCount: activeProfileStore.outliersCount,
      issueCount: activeProfileStore.qualityScore.issues,
    };
  }
}
