
import { UserButton, useUser } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

const DropdownUser = () => {
  // const user = await currentUser()
  const { user } = useUser();

  return (
    <>
      <h1 className="text-sm font-extrabold">{user?.publicMetadata.role as string}</h1>
      <UserButton />
    </>
  );
};

export default DropdownUser;
