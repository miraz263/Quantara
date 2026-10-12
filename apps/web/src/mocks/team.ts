import { TeamMember } from '../types';

export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-1',
    user: {
      id: 'u-1',
      email: 'ahmed.rahman@quantara.ai',
      full_name: 'Ahmed Rahman',
      role: 'owner',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    role: 'owner',
    joined_at: '2026-01-10T00:00:00Z'
  },
  {
    id: 'tm-2',
    user: {
      id: 'u-2',
      email: 'sarah.khan@quantara.ai',
      full_name: 'Dr. Sarah Khan',
      role: 'statistician',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    },
    role: 'statistician',
    joined_at: '2026-02-15T00:00:00Z'
  },
  {
    id: 'tm-3',
    user: {
      id: 'u-3',
      email: 'tanvir.hasan@quantara.ai',
      full_name: 'Tanvir Hasan',
      role: 'analyst'
    },
    role: 'analyst',
    joined_at: '2026-04-01T00:00:00Z'
  }
];
