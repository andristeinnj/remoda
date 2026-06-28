import "server-only";

/**
 * Dropp.is shipping integration.
 *
 * Dropp exposes a REST API (docs: https://documenter.getpostman.com/view/1057001/SzKPU13n)
 * for listing pickup locations and registering shipments. The exact endpoint
 * paths, auth header and request bodies must be confirmed against the merchant
 * account — they are isolated here so the rest of the app stays stable.
 *
 * Until DROPP_API_KEY is set, getDroppLocations() returns a small sample list so
 * the checkout UI works in development.
 */

export type DroppLocation = {
  id: string;
  name: string;
  address: string;
  zip: string;
  city: string;
};

const DROPP_API_BASE = process.env.DROPP_API_BASE ?? "https://api.dropp.is";
const DROPP_API_KEY = process.env.DROPP_API_KEY;
export const isDroppConfigured = Boolean(DROPP_API_KEY);

const SAMPLE_LOCATIONS: DroppLocation[] = [
  { id: "dropp-101-hallveigarstigur", name: "Dropp – Hallveigarstígur", address: "Hallveigarstígur 1", zip: "101", city: "Reykjavík" },
  { id: "dropp-104-kringlan", name: "Dropp – Kringlan", address: "Kringlan 4-12", zip: "103", city: "Reykjavík" },
  { id: "dropp-201-smaralind", name: "Dropp – Smáralind", address: "Hagasmári 1", zip: "201", city: "Kópavogur" },
  { id: "dropp-220-fjordur", name: "Dropp – Fjörður", address: "Fjarðargata 13-15", zip: "220", city: "Hafnarfjörður" },
  { id: "dropp-600-glerartorg", name: "Dropp – Glerártorg", address: "Glerárgata 36", zip: "600", city: "Akureyri" },
  { id: "dropp-800-selfoss", name: "Dropp – Selfoss", address: "Austurvegur 3-5", zip: "800", city: "Selfoss" },
];

export async function getDroppLocations(): Promise<DroppLocation[]> {
  if (!isDroppConfigured) return SAMPLE_LOCATIONS;
  try {
    const res = await fetch(`${DROPP_API_BASE}/dropp/locations`, {
      headers: { Authorization: `Bearer ${DROPP_API_KEY}` },
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Dropp locations ${res.status}`);
    const data = await res.json();
    // TODO: map the real Dropp response shape to DroppLocation[]
    return data as DroppLocation[];
  } catch (err) {
    console.error("getDroppLocations failed, using sample list", err);
    return SAMPLE_LOCATIONS;
  }
}

export type DroppShipmentInput = {
  orderNumber: string;
  locationId: string;
  customerName: string;
  customerEmail: string;
  phone?: string | null;
};

export type DroppShipmentResult = {
  barcode: string | null;
};

export async function createDroppShipment(
  input: DroppShipmentInput
): Promise<DroppShipmentResult> {
  if (!isDroppConfigured) {
    // Dev fallback: pretend a shipment was booked.
    return { barcode: `TEST-${input.orderNumber}` };
  }
  const res = await fetch(`${DROPP_API_BASE}/dropp/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${DROPP_API_KEY}`,
      "Content-Type": "application/json",
    },
    // TODO: map to the real Dropp create-order body
    body: JSON.stringify({
      reference: input.orderNumber,
      locationId: input.locationId,
      recipient: {
        name: input.customerName,
        email: input.customerEmail,
        phone: input.phone,
      },
    }),
  });
  if (!res.ok) {
    throw new Error(`Dropp create shipment failed: ${res.status}`);
  }
  const data = await res.json();
  return { barcode: data.barcode ?? null };
}
