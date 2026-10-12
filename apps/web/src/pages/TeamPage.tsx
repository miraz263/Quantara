import React from 'react';
import { Users, UserPlus, Shield, CheckCircle2 } from 'lucide-react';
import { MOCK_TEAM } from '../mocks/mockData';
import { Button } from '../components/ui/Button';

export const TeamPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-quantara-950 p-8 overflow-y-auto max-w-5xl mx-auto w-full space-y-6">
      <div className="flex items-center justify-between border-b border-quantara-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Team & Role Access Control
          </h1>
          <p className="text-xs text-quantara-400 mt-1">
            Manage organization members, statisticians, researchers, and project role permissions.
          </p>
        </div>

        <Button variant="primary" size="sm">
          <UserPlus className="w-3.5 h-3.5" /> Invite Member
        </Button>
      </div>

      <div className="bg-quantara-900 border border-quantara-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-quantara-950 text-quantara-400 font-semibold border-b border-quantara-800 uppercase">
              <th className="py-3 px-4">Member</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-quantara-800 text-slate-200">
            {MOCK_TEAM.map((member) => (
              <tr key={member.id} className="hover:bg-quantara-800/40 transition">
                <td className="py-3 px-4 font-semibold flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center font-bold text-[10px] text-white">
                    {member.user.full_name[0]}
                  </div>
                  <span>{member.user.full_name}</span>
                </td>
                <td className="py-3 px-4 font-mono text-quantara-400">{member.user.email}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 rounded text-[11px] font-mono capitalize">
                    {member.role}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-quantara-400">{new Date(member.joined_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
