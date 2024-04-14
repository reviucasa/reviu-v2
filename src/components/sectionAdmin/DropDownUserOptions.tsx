import { User, UserStatus, UserType, updateUser } from "@/models/user";
import { Menu } from "@headlessui/react";
import {
  BiBlock,
  BiCheckDouble,
  BiDotsHorizontalRounded,
  BiShield,
  BiShieldMinus,
  BiSolidShield,
  BiUser,
} from "react-icons/bi";
import { Float } from "@headlessui-float/react";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

export const DropDownUserOptions = ({
  user,
  refetch,
}: {
  user: User;
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<User[] | undefined, Error>>;
}) => {
  return (
    <Menu>
      <Float placement="bottom-end" offset={2}>
        <Menu.Button className="text-gray-500 cursor-pointer hover:text-secondary-300">
          <BiDotsHorizontalRounded className="h-6 w-6" />
        </Menu.Button>
        <Menu.Items className="bg-white flex flex-col w-min rounded-lg border border-gray-200">
          {user.type != UserType.Agency && (
            <Menu.Item>
              {({ active }) => (
                <div
                  className={`flex items-center py-2 px-3 rounded-t-lg cursor-pointer  ${
                    active && " bg-gray-50"
                  }`}
                  onClick={async () => {
                    // TODO: call cloud function to make admin
                    await updateUser(user.id, {
                      type:
                        user.type == UserType.Admin
                          ? UserType.User
                          : UserType.Admin,
                    });
                    refetch();
                  }}
                >
                  {user.type == UserType.Admin ? (
                    <BiShieldMinus className="text-gray-400" />
                  ) : (
                    <BiSolidShield className="text-purple-400" />
                  )}
                  <span className="ml-2">
                    {user.type == UserType.Admin
                      ? "Revoke Admin"
                      : "Make admin"}
                  </span>
                </div>
              )}
            </Menu.Item>
          )}
          <Menu.Item>
            {({ active }) => (
              <div
                className={`flex items-center py-2 px-3 rounded-b-lg cursor-pointer ${
                  active && " bg-gray-50"
                }`}
                onClick={async () => {
                  // TODO: do through cloud function
                  await updateUser(user.id, {
                    status:
                      user.status == UserStatus.Active
                        ? UserStatus.Banned
                        : UserStatus.Active,
                  });
                  refetch();
                }}
              >
                {user.status == UserStatus.Active ? (
                  <BiBlock className="text-red-400" />
                ) : (
                  <BiCheckDouble className="text-green-400" />
                )}
                <span className="ml-2">
                  {user.status == UserStatus.Active ? "Ban User" : "Activate"}
                </span>
              </div>
            )}
          </Menu.Item>
        </Menu.Items>
      </Float>
    </Menu>
  );
};
