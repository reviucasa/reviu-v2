import { User, UserStatus, UserType, updateUser } from "@/models/user";
import { Menu } from "@headlessui/react";
import {
  BiBlock,
  BiCheckDouble,
  BiDotsHorizontalRounded,
  BiShieldMinus,
  BiSolidShield,
} from "react-icons/bi";
import { Float } from "@headlessui-float/react";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { functions } from "@/firebase/config";
import { httpsCallable } from "firebase/functions";

export const DropDownUserOptions = ({
  user,
  refetch,
}: {
  user: User;
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<User[] | undefined, Error>>;
}) => {
  const onChangeUserType = async () => {
    // Update type field in database
    await updateUser(user.id, {
      type: user.type == UserType.Admin ? UserType.User : UserType.Admin,
    });
    // Prepare claims and call cloud function to update claims
    const claimsToUpdate = {
      admin: !(user.type == UserType.Admin),
    };
    httpsCallable(
      functions,
      "addCustomClaim"
    )({
      email: user.email,
      claims: claimsToUpdate,
    })
      .then((result: any) => {
        console.log(result.data.message);
      })
      .catch((error) => {
        console.error("Error updating claims:", error);
      });
    // Refetch
    refetch();
  };

  const onChangeUserStatus = async () => {
    const status =
      user.status == UserStatus.Active
        ? UserStatus.Suspended
        : UserStatus.Active;
    // Update status field in database
    await updateUser(user.id, {
      status,
    });
    // Prepare claims and call cloud function
    const claimsToUpdate = {
      status,
    };
    httpsCallable(
      functions,
      "addCustomClaim"
    )({
      email: user.email,
      claims: claimsToUpdate,
    })
      .then((result: any) => {
        console.log(result.data.message);
      })
      .catch((error) => {
        console.error("Error updating claims:", error);
      });
    // Refetch
    refetch();
  };

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
                  className={`flex items-center py-2 px-3 rounded-t-lg cursor-pointer ${
                    active && " bg-gray-50"
                  }`}
                  onClick={onChangeUserType}
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
                onClick={onChangeUserStatus}
              >
                {user.status == UserStatus.Active ? (
                  <BiBlock className="text-red-400" />
                ) : (
                  <BiCheckDouble className="text-green-400" />
                )}
                <span className="ml-2">
                  {user.status == UserStatus.Active ? "Suspend" : "Activate"}
                </span>
              </div>
            )}
          </Menu.Item>
        </Menu.Items>
      </Float>
    </Menu>
  );
};
