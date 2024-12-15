"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const UserInfo = () => {
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  const handleNavigation = () => {
    const userId = 123; 
    router.push(`/user/${userId}`);
  };

  if (!isSignedIn) {
    return <div>Please sign in to view your information.</div>;
  }

  return (
    <div className="ml-[110px]">
      <h2>Welcome!</h2>
      <p>Email: {user.primaryEmailAddress?.emailAddress}</p>
      <button onClick={handleNavigation}>
        Go to User Details (ID: 123)
      </button>
    </div>
  );
};

export default UserInfo;
