import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CATEGORY_LABELS, GROUP_SIZE_LABELS, PAYMENT_LABELS } from "@/features/places/constants";
import type { Place } from "@/features/places/types/place";
import { formatPriceRange } from "@/features/places/utils/format-price-range";

export default function AdminPlacesTable({ places }: { places: Place[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Amenities</TableHead>
          <TableHead>Payment</TableHead>
          <TableHead>Group size</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {places.map((place) => (
          <TableRow key={place.id}>
            <TableCell className="max-w-56 truncate font-medium">{place.name}</TableCell>
            <TableCell className="max-w-64 truncate text-muted-foreground">{place.address}</TableCell>
            <TableCell>{CATEGORY_LABELS[place.category]}</TableCell>
            <TableCell>{formatPriceRange(place.priceRange)}</TableCell>
            <TableCell>
              <div className="flex gap-1.5">
                {place.hasOutlets && <Badge variant="secondary">Outlets</Badge>}
                {place.hasWifi && <Badge variant="secondary">Wi-Fi</Badge>}
                {!place.hasOutlets && !place.hasWifi && <span className="text-muted-foreground">—</span>}
              </div>
            </TableCell>
            <TableCell>{place.payments.map((p) => PAYMENT_LABELS[p]).join(", ")}</TableCell>
            <TableCell>{GROUP_SIZE_LABELS[place.groupSize]}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
