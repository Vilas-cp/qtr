"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

const UserDetails = () => {
  const params = useParams();
  const userId = params.id;

  return (
    <div className="ml-[110px]">
      <h1>User Details</h1>
      <p>User ID: {userId}</p>
    </div>
  );
};

export default UserDetails;
