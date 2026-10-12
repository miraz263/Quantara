import { describe, it, expect, beforeEach } from 'vitest';
import { ProjectService } from '../services/projectService';

describe('ProjectService Unit Tests', () => {
  it('should fetch all projects', async () => {
    const projects = await ProjectService.getProjects();
    expect(projects.length).toBeGreaterThan(0);
  });

  it('should filter projects by search query', async () => {
    const projects = await ProjectService.getProjects({ searchQuery: 'Healthcare' });
    expect(projects.every(p => p.name.includes('Healthcare') || p.description?.includes('Healthcare'))).toBe(true);
  });

  it('should filter projects by status', async () => {
    const activeProjects = await ProjectService.getProjects({ searchQuery: '', status: 'active' });
    expect(activeProjects.every(p => p.status === 'active')).toBe(true);
  });

  it('should sort projects by name A-Z', async () => {
    const sorted = await ProjectService.getProjects(undefined, 'name_asc');
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].name.localeCompare(sorted[i + 1].name)).toBeLessThanOrEqual(0);
    }
  });

  it('should create a new project', async () => {
    const created = await ProjectService.createProject({
      name: 'Test Statistical Experiment',
      description: 'Unit test project creation',
      tags: ['unit-test'],
      visibility: 'private'
    });

    expect(created.id).toBeDefined();
    expect(created.name).toBe('Test Statistical Experiment');

    const fetched = await ProjectService.getProject(created.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.name).toBe('Test Statistical Experiment');
  });

  it('should duplicate a project', async () => {
    const original = (await ProjectService.getProjects())[0];
    const duplicated = await ProjectService.duplicateProject(original.id);

    expect(duplicated.name).toBe(`${original.name} — Copy`);
    expect(duplicated.id).not.toBe(original.id);
  });

  it('should archive a project', async () => {
    const original = (await ProjectService.getProjects())[0];
    const archived = await ProjectService.archiveProject(original.id);

    expect(archived.status).toBe('archived');
  });

  it('should delete a project', async () => {
    const created = await ProjectService.createProject({
      name: 'To Be Deleted',
      tags: [],
      visibility: 'private'
    });

    const success = await ProjectService.deleteProject(created.id);
    expect(success).toBe(true);

    const fetched = await ProjectService.getProject(created.id);
    expect(fetched).toBeNull();
  });
});
