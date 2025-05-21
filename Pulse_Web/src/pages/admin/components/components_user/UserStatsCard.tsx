// import React from "react";

interface Props {
  title: string;
  value: number;
}

const UserStatsCard = ({ title, value }: Props) => (
  <div className="bg-zinc-600 p-4 rounded-xl shadow-md text-center w-44  transition">
    <p className="text-sm text-zinc-400">{title}</p>
    <p className="text-2xl font-bold text-white mt-2 ">{value}</p>
  </div>
);

export default UserStatsCard;
