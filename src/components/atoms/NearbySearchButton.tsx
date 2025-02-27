import { useRouter } from "next/navigation";
import Image from "next/image";
import marker from "public/images/iconMarker.png";
import { ComboboxOption } from "@headlessui/react";

const NearbySearchButton = () => {
  const router = useRouter();

  const handleSearchNearby = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        router.push(`/explore?lat=${latitude}&lng=${longitude}`);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert(
          "Unable to retrieve your location. Please enable location services."
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <ComboboxOption
      className="cursor-pointer px-1 py-3 rounded-md hover:bg-secondary-300"
      key="nearby"
      value={undefined}
      onClick={handleSearchNearby}
    >
      <div className="flex flex-row space-x-2">
        <Image
          src={marker}
          alt="lupa"
          className="h-5 w-auto text-gray-400 left-2.5 top-2.5"
          aria-hidden="true"
        />
        <span>Buscar cerca de ti</span>
      </div>
    </ComboboxOption>
  );
};

export default NearbySearchButton;
