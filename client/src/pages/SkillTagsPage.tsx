// SkillTags.tsx
import React from "react";

interface SkillTagsProps {
    skills: string[]; // Array of skill names
}

const SkillTags: React.FC<SkillTagsProps> = ({ skills }) => {
    return (
        <div className="flex flex-wrap mt-4 ml-10 mr-10">
            {skills.map((skill, index) => (
                <span
                    key={index}
                    className="bg-gradient-to-r from-orange-500 to-purple-600 text-white py-1 px-3 rounded-full text-sm font-semibold m-1"
                >
                    {skill}
                </span>
            ))}
        </div>
    );
};

export default SkillTags;
