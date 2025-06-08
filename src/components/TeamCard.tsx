import React from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";

interface TeamMember {
  name: string;
  email: string;
  role: string;
}

interface TeamCardProps {
  title?: string;
  members: TeamMember[];
}

const TeamCard: React.FC<TeamCardProps> = ({
  title = "Team Members",
  members,
}) => {
  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-md w-full h-full">
      <h2 className="text-lg font-semibold text-white mb-6 mt-2">{title}</h2>
      <div className="space-y-4 overflow-y-auto pr-1 max-h-50 md: max-h-90 ">
        {members.map((member, idx) => (
          <div key={idx} className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mt-1">
              <UserCircleIcon className="text-gray-500 w-8 h-8" />
            </div>
            <div>
              <div className="text-white font-medium">{member.name}</div>
              <div className="text-gray-400 text-sm">{member.email}</div>
              <div className="text-purple-400 text-sm italic">{member.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamCard;
