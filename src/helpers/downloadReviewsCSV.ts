import {
  Community,
  Location,
  Management,
  Neighbourhood,
  Opinion,
  Review,
  Stay,
  Valuation,
} from "@/models/review";
import { User } from "@/models/user";

// --- Helpers ---

const escapeCSV = (value: any): string => {
  if (value === null || value === undefined) return "";

  let stringValue = String(value);

  // Handle Firestore Timestamps or Date objects
  if (typeof value === "object" && value && "toDate" in value) {
    stringValue = value.toDate().toISOString();
  } else if (value instanceof Date) {
    stringValue = value.toISOString();
  }

  // Escape special characters (quotes, commas, newlines)
  if (
    stringValue.includes(";") ||
    stringValue.includes("\n") ||
    stringValue.includes('"')
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

const boolToYesNo = (val: boolean | undefined | null) => {
  if (val === undefined || val === null) return "";
  return val ? "Yes" : "No";
};

// --- Main Function ---

export const downloadCSV = (reviews: Review[], users: User[]) => {
  // 1. Create User Map for O(1) lookup
  const userMap = new Map<string, User>();
  users.forEach((user) => userMap.set(user.id, user));

  // 2. Define All Headers (Audited against types)
  const headers = [
    // --- Review Meta ---
    "Review ID",
    "Status",
    "Time Created",
    "Time Updated",
    "Step",
    "Building ID",
    "Place ID",
    "Catastro Ref",

    // --- Location ---
    "Address",
    "Loc Type",
    "Street",
    "Number",
    "Municipality",
    "Province",
    "Lat",
    "Lng",

    // --- User Data ---
    "User ID",
    "User Name",
    "User Lastname",
    "User Email",
    "User Type",
    "User Status",
    "Gender",
    "Birthday",
    "Country",
    "Accepted Terms",
    "Date Accepted Terms",
    "Subscribed Newsletter",
    "User Created At",

    // --- Stay ---
    "Current Residence",
    "Period (Start)",
    "Period (End)",
    "Start Price",
    "End Price",

    // --- Opinion ---
    "Title",
    "Recommend",
    "Positive Opinion",
    "Negative Opinion",
    "Image Count", // Requested specifically

    // --- Management ---
    "Is Agency?",
    "Agency ID",
    "Real Estate Agency Name",
    "Deposit Rating",
    "Problem Solving Rating",
    "Landlord Dealing",
    "Agency Dealing",
    "Advice Landlord",
    "Advice Real Estate",

    // --- Community ---
    "Community Comment",
    "Building Cleaning",
    "Building Maintenance",
    "Neighbors Relationship",
    "Touristic Apts",
    "Community Services", // Joined Array
    "Building Neighborhood", // Joined Array

    // --- Neighbourhood ---
    "Neighbourhood Comment",
    "Neighbourhood Cleaning",
    "Neighbourhood Noise",
    "Neighbourhood Security",
    "Tourists Rating",
    "Neighbourhood Services", // Joined Array
    "Neighbourhood Vibe", // Joined Array

    // --- Valuation (Apartment Specifics) ---
    "Apt Light",
    "Apt Maintenance",
    "Apt Noise",
    "Summer Temp",
    "Winter Temp",
    "Apt Services", // Joined Array
  ];

  // 3. Map Data to Rows
  const rows = reviews.map((review) => {
    const user = userMap.get(review.userId);

    // Destructure review data with defaults
    const d = review.data || {};
    const op: Opinion | undefined = d.opinion;
    const mgmt: Management | undefined = d.management;
    const comm: Community | undefined = d.community;
    const hood: Neighbourhood | undefined = d.neighbourhood;
    const val: Valuation | undefined = d.valuation;
    const stay: Stay | undefined = d.stay;
    const loc: Location | undefined = review.location;

    // Helper to flatten coordinates
    // Assuming Coordinates type has lat/lng or latitude/longitude
    const coords = loc?.coordinates as any;
    const lat = coords?.lat || coords?.latitude || "";
    const lng = coords?.lng || coords?.longitude || "";

    return [
      // --- Review Meta ---
      review.id,
      review.status,
      review.timeCreated,
      review.timeUpdated,
      d.step,
      review.buildingId,
      review.placeId,
      review.catastroRef,

      // --- Location ---
      review.address,
      loc?.type,
      loc?.street,
      loc?.number,
      loc?.municipality,
      loc?.province,
      lat,
      lng,

      // --- User Data ---
      user?.id,
      user?.name,
      user?.lastname,
      user?.email,
      user?.type,
      user?.status,
      user?.gender,
      user?.birthday,
      user?.country,
      boolToYesNo(user?.acceptedTerms),
      user?.dateAcceptedTerms,
      boolToYesNo(user?.subscribedToNewsletter),
      user?.timeCreated,

      // --- Stay ---
      boolToYesNo(stay?.currentResidence),
      stay?.startMonth && stay?.startYear
        ? `${stay.startMonth}/${stay.startYear}`
        : "",
      stay?.endMonth && stay?.endYear ? `${stay.endMonth}/${stay.endYear}` : "",
      stay?.startPrice,
      stay?.endPrice,

      // --- Opinion ---
      op?.title,
      boolToYesNo(op?.recomend),
      op?.positive,
      op?.negative,
      op?.images ? op.images.length : 0,

      // --- Management ---
      boolToYesNo(mgmt?.isRealStateAgency),
      mgmt?.agencyId,
      mgmt?.realStateAgency, // Name string
      mgmt?.deposit,
      mgmt?.problemSolving,
      mgmt?.landlordDealing,
      mgmt?.realStateDealing,
      mgmt?.adviceLandlord,
      mgmt?.adviceRealState,

      // --- Community ---
      comm?.comment,
      comm?.buildingCleaning,
      comm?.buildingMaintenance,
      comm?.neighborsRelationship,
      comm?.touristicApartments,
      comm?.services?.join(" | "),
      comm?.buildingNeighborhood?.join(" | "),

      // --- Neighbourhood ---
      hood?.comments,
      hood?.cleaning,
      hood?.noise,
      hood?.security,
      hood?.tourists,
      hood?.services?.join(" | "),
      hood?.vibe?.join(" | "),

      // --- Valuation ---
      val?.light,
      val?.maintenance,
      val?.noise,
      val?.summerTemperature,
      val?.winterTemperature,
      val?.services?.join(" | "),
    ]
      .map(escapeCSV)
      .join(";");
  });

  // 4. Combine & Download
  const csvContent = [headers.join(";"), ...rows].join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute(
    "download",
    `reviews_full_export_${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
