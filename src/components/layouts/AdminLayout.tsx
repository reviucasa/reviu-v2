"use client";
import Image from "next/image";
import Logo from "public/images/reviuLogo.svg";
import { Fragment, useState } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import {
  BiFolder,
  BiHome,
  BiMenu,
  BiPencil,
  BiReceipt,
  BiUser,
  BiX,
} from "react-icons/bi";
import { useRouter } from "@/navigation";

const navigation = [
  { title: "", items: [{ name: "Dashboard", href: "/admin", icon: BiHome }] },
  {
    title: "Reviews",
    items: [
      { name: "Reviews", href: "/admin/reviews/", icon: BiReceipt },
      { name: "Drafts", href: "/admin/reviews/drafts/", icon: BiPencil },
    ],
  },
  {
    title: "Users",
    items: [{ name: "Users", href: "/admin/users/", icon: BiUser }],
  },
  {
    title: "Blog",
    items: [
      { name: "All Posts", href: "/admin/blog", icon: BiFolder },
      { name: "New Post", href: "/admin/blog/new", icon: BiPencil },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <Transition show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setSidebarOpen}
        >
          <TransitionChild
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </TransitionChild>

          <div className="fixed inset-0 flex">
            <TransitionChild
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1">
                <TransitionChild
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <BiX className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </TransitionChild>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                  <div className="flex h-16 shrink-0 items-center">
                    <Image
                      quality={100}
                      src={Logo}
                      alt="Reviu Casa"
                      width={120}
                      className="object-contain cursor-pointer h-8 w-auto"
                      onClick={() => {
                        router.push("/");
                      }}
                    />
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      {navigation.map((menu) => (
                        <li key={menu.title}>
                          {menu.title != "" && (
                            <div className="text-xs font-semibold leading-6 text-gray-400">
                              {menu.title}
                            </div>
                          )}
                          <ul role="list" className="-mx-2 mt-2 space-y-1">
                            {menu.items?.map((item) => (
                              <li key={item.name}>
                                <a
                                  href={item.href}
                                  className={
                                    "  text-gray-800 hover:bg-gray-100 group flex gap-x-3 p-2 text-sm leading-6"
                                  }
                                  style={{ textDecoration: "none" }}
                                >
                                  <item.icon
                                    className={
                                      "text-primary-300  h-5 w-5 shrink-0"
                                    }
                                    aria-hidden="true"
                                  />
                                  <span className="truncate">{item.name}</span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
          <div className="flex h-16 shrink-0 items-center">
            <Image
              quality={100}
              src={Logo}
              alt="Reviu Casa"
              width={120}
              className="object-contain cursor-pointer h-8 w-auto"
              onClick={() => {
                router.push("/");
              }}
            />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-5">
              {navigation.map((menu) => (
                <li key={menu.title}>
                  {menu.title != "" && (
                    <div className="text-xs leading-6 text-gray-400">
                      {menu.title}
                    </div>
                  )}
                  <ul role="list" className="-mx-2 mt-1">
                    {menu.items?.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={
                            "  text-gray-800 hover:bg-gray-100 group flex gap-x-3 p-2 text-sm leading-6"
                          }
                          style={{ textDecoration: "none" }}
                        >
                          <item.icon
                            className={"text-primary-300  h-5 w-5 shrink-0"}
                            aria-hidden="true"
                          />
                          <span className="truncate">{item.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="sticky top-0 z-40 flex flex-row justify-between items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <Image
          quality={100}
          src={Logo}
          alt="Reviu Casa"
          width={120}
          className="object-contain cursor-pointer h-8 w-auto"
          onClick={() => {
            router.push("/");
          }}
        />

        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden w-min"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <BiMenu className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      <main className="py-10 lg:pl-64">
        <div className="px-4 sm:px-6 lg:px-8 space-y-10 pb-10">{children}</div>
      </main>
    </div>
  );
}
