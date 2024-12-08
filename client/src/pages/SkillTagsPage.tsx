import React, { useState, useEffect } from "react";

interface SkillTagsProps {
    skills: string[]; // Array of skill names
    onRemoveSkill: (skill: string) => void; // Function to handle skill removal
    onAddSkill: (skill: string) => void; // Function to handle adding a skill
}

const SkillTags: React.FC<SkillTagsProps> = ({ skills, onRemoveSkill, onAddSkill }) => {
    const [skillList, setSkillList] = useState<string[]>(skills);
    const [previousSkills, setPreviousSkills] = useState<string[][]>([]); // Track previous states for undo

    // Listen for Ctrl+Z to undo the last removal
    useEffect(() => {
        const handleUndo = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === "z") {
                e.preventDefault();
                undoLastRemoval();
            }
        };
        window.addEventListener("keydown", handleUndo);

        return () => {
            window.removeEventListener("keydown", handleUndo);
        };
    }, [previousSkills]); // Add `previousSkills` to dependency to update when skills change

    // Undo the last removal action
    const undoLastRemoval = () => {
        if (previousSkills.length > 0) {
            const lastSkillsState = previousSkills[previousSkills.length - 1];
            setSkillList(lastSkillsState); // Restore the previous skills state
            setPreviousSkills(previousSkills.slice(0, previousSkills.length - 1)); // Remove last state
        }
    };

    // Handle removing a skill
    const handleRemoveSkill = (skill: string) => {
        const updatedSkills = skillList.filter((s) => s !== skill); // Remove the specific skill clicked
        setPreviousSkills([...previousSkills, skillList]); // Save current state for undo
        setSkillList(updatedSkills); // Update the state with the new list of skills
        onRemoveSkill(skill); // Call the parent handler to notify about the removal
    };

    // Handle adding a new skill
    const handleAddSkill = (skill: string) => {
        setSkillList((prevSkillList) => [...prevSkillList, skill]); // Add a new skill to the list
        onAddSkill(skill); // Call the parent handler to notify about the new skill
    };

    return (
        <div className="flex flex-wrap mt-4 ml-10 mr-10">
            {skillList.map((skill, index) => (
                <span
                    key={index}
                    className="relative bg-gradient-to-r from-orange-500 to-purple-600 text-white py-1 px-3 rounded-full text-sm font-semibold m-1 cursor-pointer flex items-center gap-2"
                >
                    {skill}

                    {/* Cross Icon */}
                    <span
                        className="absolute top-0 right-0 text-white text-lg cursor-pointer transition-all duration-300 opacity-0 hover:opacity-100 hover:bg-white hover:bg-opacity-30 rounded-full p-1 w-5 h-5 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2"
                        onClick={() => handleRemoveSkill(skill)} // Remove the specific skill when the cross is clicked
                    >
                        ✖
                    </span>
                </span>
            ))}

            {/* Add More Skills Section */}
            <span
                className="relative bg-gradient-to-r from-gray-500 to-gray-700 text-white py-1 px-3 rounded-full text-sm font-semibold m-1 cursor-pointer flex items-center gap-2"
                onClick={() => handleAddSkill("New Skill")} // Example: Add new skill
            >
                + Add More Skills
            </span>
        </div>
    );
};

export default SkillTags;
