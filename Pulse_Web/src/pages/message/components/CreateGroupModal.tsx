import React, { useState, useRef } from 'react';
import { X, Camera } from 'lucide-react';
import { Member } from '../../../redux/slice/types';

interface Props {
    users: Member[];
    onClose: () => void;
    onCreate: (groupName: string, members: string[], avatar?: File | null) => void;
}

const CreateGroupModal: React.FC<Props> = ({ users, onClose, onCreate }) => {
    const [groupName, setGroupName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const filteredUsers = users.filter((u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );

    const toggleUser = (id: string) => {
        setSelectedUsers((prev) =>
            prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
        );
    };

    return (
        <div className="fixed inset-0 bg-gray-500/20 flex items-center justify-center z-50 font-sans">
            <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] p-6 relative shadow-xl overflow-hidden">
                {/* Close */}
                <button className="absolute top-4 right-4 text-gray-500 hover:text-black cursor-pointer" onClick={onClose}>
                    <X size={20} />
                </button>

                {/* Avatar */}
                <div className="flex justify-center mb-4">
                    <div
                        className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition relative"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {avatarFile ? (
                            <img
                                src={URL.createObjectURL(avatarFile)}
                                alt="Group Avatar"
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <Camera className="text-gray-500" size={24} />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                        />
                    </div>
                </div>

                {/* Group name */}
                <label className="text-sm text-gray-600">Group name</label>
                <input
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter group name..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 mt-1 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-200"
                />

                {/* Search members */}
                <label className="text-sm text-gray-600">Search members</label>
                <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 mt-1 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-200"
                />

                {/* User list */}
                <div className="space-y-2 h-[200px] overflow-y-auto pr-1">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <div
                                key={user.userId}
                                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
                            >
                                <input
                                    className='cursor-pointer'
                                    type="checkbox"
                                    checked={selectedUsers.includes(user.userId)}
                                    onChange={() => toggleUser(user.userId)}
                                />
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <span className="text-sm text-gray-900">{user.name}</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-gray-400 p-2">No users found</div>
                    )}
                </div>

                {/* Action buttons */}
                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md text-sm bg-gray-200 hover:bg-gray-300 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={!groupName || selectedUsers.length === 0}
                        onClick={() => onCreate(groupName, selectedUsers, avatarFile)}
                        className={`px-4 py-2 rounded-md text-sm text-white ${!groupName || selectedUsers.length === 0
                                ? 'bg-blue-300 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
                            }`}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateGroupModal;