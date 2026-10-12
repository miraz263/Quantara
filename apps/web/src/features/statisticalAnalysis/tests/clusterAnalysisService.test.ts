import { describe, it, expect } from 'vitest';
import { StatisticalService } from '../services/statisticalService';

describe('Module 13 — Cluster Analysis Unit Tests', () => {
  it('should execute K-Means Cluster Analysis procedure deterministically', async () => {
    const result = await StatisticalService.runAnalysis({
      id: 'ana-kmeans-test',
      datasetId: 'ds-001',
      datasetVersion: 3,
      procedure: 'kmeans',
      title: 'K-Means Cluster Analysis (K=4)',
      variables: ['income', 'satisfaction', 'age', 'work_exp', 'quality_score', 'loyalty_index'],
      options: {
        clusterProcedure: 'kmeans',
        numberOfClusters: 4,
        standardizationMethod: 'zscore',
        initializationMethod: 'kmeans_plus_plus',
        randomSeed: 42,
        maxIterations: 100,
        convergenceTolerance: 0.0001,
        silhouetteAnalysis: true,
        elbowMethod: true,
        calinskiHarabasz: true,
        daviesBouldin: true,
        saveClusterVariable: true,
      },
      createdAt: new Date().toISOString(),
    });

    expect(result.status).toBe('completed');
    expect(result.procedure).toBe('kmeans');
    expect(result.syntax).toContain('QUICK CLUSTER');
    expect(result.syntax).toContain('/CRITERIA=CLUSTERS(4)');
    expect(result.syntax).toContain('/METHOD=KMEANS_PLUS_PLUS');
    expect(result.tables.length).toBeGreaterThanOrEqual(4);

    const sizesTbl = result.tables.find((t) => t.id === 'tbl-kmeans-sizes');
    const rawCentroidsTbl = result.tables.find((t) => t.id === 'tbl-kmeans-centroids-raw');
    const stdCentroidsTbl = result.tables.find((t) => t.id === 'tbl-kmeans-centroids-std');
    const valTbl = result.tables.find((t) => t.id === 'tbl-kmeans-validation');
    const membershipTbl = result.tables.find((t) => t.id === 'tbl-kmeans-membership');

    expect(sizesTbl).toBeDefined();
    expect(rawCentroidsTbl).toBeDefined();
    expect(stdCentroidsTbl).toBeDefined();
    expect(valTbl).toBeDefined();
    expect(membershipTbl).toBeDefined();

    expect(sizesTbl?.rows.some((r) => r.n === 421)).toBe(true);
    expect(rawCentroidsTbl?.rows.some((r) => r.variable === 'Income ($)' && r.overall === 65200.0)).toBe(true);
    expect(stdCentroidsTbl?.rows.some((r) => r.variable === 'Age' && r.c3 === 1.47)).toBe(true);
    expect(valTbl?.rows.some((r) => r.k === 4 && r.wcss === 1245.8 && r.silhouette === 0.642)).toBe(true);
  });

  it('should execute Agglomerative Hierarchical Clustering procedure deterministically', async () => {
    const result = await StatisticalService.runAnalysis({
      id: 'ana-hierarchical-test',
      datasetId: 'ds-001',
      datasetVersion: 3,
      procedure: 'hierarchical',
      title: "Hierarchical Cluster Analysis (Ward's Linkage, Cut K=4)",
      variables: ['income', 'satisfaction', 'age', 'work_exp', 'quality_score', 'loyalty_index'],
      options: {
        clusterProcedure: 'hierarchical',
        numberOfClusters: 4,
        linkageMethod: 'ward',
        distanceMetric: 'squared_euclidean',
        standardizationMethod: 'zscore',
        silhouetteAnalysis: true,
        saveClusterVariable: true,
      },
      createdAt: new Date().toISOString(),
    });

    expect(result.status).toBe('completed');
    expect(result.procedure).toBe('hierarchical');
    expect(result.syntax).toContain('CLUSTER');
    expect(result.syntax).toContain('/METHOD WARD');
    expect(result.syntax).toContain('/MEASURE SEUCLID');
    expect(result.tables.length).toBeGreaterThanOrEqual(3);

    const summaryTbl = result.tables.find((t) => t.id === 'tbl-hier-summary');
    const agglomTbl = result.tables.find((t) => t.id === 'tbl-hier-agglomeration');
    const sizesTbl = result.tables.find((t) => t.id === 'tbl-hier-cluster-sizes');

    expect(summaryTbl).toBeDefined();
    expect(agglomTbl).toBeDefined();
    expect(sizesTbl).toBeDefined();

    expect(summaryTbl?.rows.some((r) => r.metric === 'Selected Cluster Cut (K)' && r.value === 4)).toBe(true);
    expect(agglomTbl?.rows.some((r) => r.stage === 1 && r.c1 === 'Obs #102')).toBe(true);
    expect(sizesTbl?.rows.some((r) => r.cluster === 'Cluster Branch 1' && r.n === 415)).toBe(true);
  });
});
