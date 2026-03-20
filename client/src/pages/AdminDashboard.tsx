import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LogOut, BarChart3, Calendar, Home } from "lucide-react";

type AdminTab = "overview" | "reservations" | "availability" | "apartments";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  // Redirect if not admin
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You do not have permission to access the admin panel.
          </p>
          <Button onClick={() => navigate("/")} variant="default">
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              PLAZA APARTMENTS Pamporovo
            </h1>
            <p className="text-sm text-muted-foreground">Admin Panel</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.name || "Admin"}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-border bg-muted/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "overview"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("reservations")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "reservations"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Reservations
            </button>
            <button
              onClick={() => setActiveTab("availability")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "availability"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Availability
            </button>
            <button
              onClick={() => setActiveTab("apartments")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "apartments"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Home className="w-4 h-4 inline mr-2" />
              Apartments
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "reservations" && <ReservationsTab />}
        {activeTab === "availability" && <AvailabilityTab />}
        {activeTab === "apartments" && <ApartmentsTab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 PLAZA APARTMENTS Pamporovo. Всички права запазени.
          </p>
        </div>
      </footer>
    </div>
  );
}

/**
 * Overview Tab - Shows statistics and key metrics
 */
function OverviewTab() {
  const { data: stats, isLoading } = trpc.admin.stats.useQuery();

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading statistics...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load statistics</p>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Reservations",
      value: stats.totalReservations,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Confirmed",
      value: stats.confirmedReservations,
      color: "bg-green-50 text-green-700",
    },
    {
      label: "Pending",
      value: stats.pendingReservations,
      color: "bg-yellow-50 text-yellow-700",
    },
    {
      label: "Cancelled",
      value: stats.cancelledReservations,
      color: "bg-red-50 text-red-700",
    },
    {
      label: "Total Revenue",
      value: `${(stats.totalRevenue / 100).toFixed(2)} лв`,
      color: "bg-purple-50 text-purple-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((card) => (
        <Card key={card.label} className={`p-6 ${card.color}`}>
          <p className="text-sm font-medium opacity-75">{card.label}</p>
          <p className="text-3xl font-bold mt-2">{card.value}</p>
        </Card>
      ))}
    </div>
  );
}

/**
 * Reservations Tab - Shows and manages all reservations
 */
function ReservationsTab() {
  const { data: reservations, isLoading } = trpc.admin.reservations.list.useQuery();
  const updateStatusMutation = trpc.admin.reservations.updateStatus.useMutation();

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading reservations...</p>
      </div>
    );
  }

  if (!reservations || reservations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No reservations found</p>
      </div>
    );
  }

  const handleStatusChange = async (
    id: number,
    newStatus: "pending" | "confirmed" | "cancelled" | "completed"
  ) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: newStatus });
    } catch (error) {
      console.error("Failed to update reservation status:", error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className="text-left py-3 px-4 font-semibold">ID</th>
            <th className="text-left py-3 px-4 font-semibold">Guest</th>
            <th className="text-left py-3 px-4 font-semibold">Email</th>
            <th className="text-left py-3 px-4 font-semibold">Check-in</th>
            <th className="text-left py-3 px-4 font-semibold">Check-out</th>
            <th className="text-left py-3 px-4 font-semibold">Status</th>
            <th className="text-left py-3 px-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id} className="border-b border-border hover:bg-muted/50">
              <td className="py-3 px-4">{reservation.id}</td>
              <td className="py-3 px-4">{reservation.guestName}</td>
              <td className="py-3 px-4 text-xs text-muted-foreground">
                {reservation.guestEmail}
              </td>
              <td className="py-3 px-4 text-xs">
                {new Date(reservation.checkInDate).toLocaleDateString("bg-BG")}
              </td>
              <td className="py-3 px-4 text-xs">
                {new Date(reservation.checkOutDate).toLocaleDateString("bg-BG")}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    reservation.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : reservation.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : reservation.status === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {reservation.status}
                </span>
              </td>
              <td className="py-3 px-4">
                <select
                  value={reservation.status}
                  onChange={(e) =>
                    handleStatusChange(
                      reservation.id,
                      e.target.value as "pending" | "confirmed" | "cancelled" | "completed"
                    )
                  }
                  className="text-xs px-2 py-1 border border-border rounded bg-background"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Availability Tab - Manage blocked dates
 */
function AvailabilityTab() {
  const utils = trpc.useUtils();

  const { data: apartments, isLoading: isApartmentsLoading } =
    trpc.admin.apartments.list.useQuery();

  const [selectedApartmentId, setSelectedApartmentId] = useState<number | null>(
    null
  );

  // Ensure we have a selected apartment once apartments load.
  useEffect(() => {
    if (selectedApartmentId !== null) return;
    if (!apartments || apartments.length === 0) return;
    setSelectedApartmentId(apartments[0].id);
  }, [apartments, selectedApartmentId]);

  const {
    data: blockedDates,
    isLoading: isBlockedDatesLoading,
  } = trpc.admin.availability.getBlockedDates.useQuery(
    {
      apartmentId: selectedApartmentId ?? 0,
    },
    {
      enabled: selectedApartmentId !== null,
    }
  );

  const blockDateMutation = trpc.admin.availability.blockDate.useMutation();
  const unblockDateMutation = trpc.admin.availability.unblockDate.useMutation();

  const [blockDateValue, setBlockDateValue] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  const invalidateBlockedDates = async (apartmentId: number) => {
    await utils.admin.availability.getBlockedDates.invalidate({
      apartmentId,
    });
  };

  const handleBlock = async () => {
    if (selectedApartmentId === null) return;
    if (!blockDateValue) return;

    const [yearStr, monthStr, dayStr] = blockDateValue.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr);
    const day = Number(dayStr);

    // Noon avoids timezone off-by-one issues when converting to/from ISO date strings.
    const date = new Date(year, month - 1, day, 12, 0, 0, 0);

    await blockDateMutation.mutateAsync({
      apartmentId: selectedApartmentId,
      date,
      reason: reason.trim() ? reason.trim() : undefined,
    });

    await invalidateBlockedDates(selectedApartmentId);

    setBlockDateValue("");
    setReason("");
  };

  const handleUnblock = async (blockedDateId: number) => {
    if (selectedApartmentId === null) return;

    await unblockDateMutation.mutateAsync({
      id: blockedDateId,
    });

    await invalidateBlockedDates(selectedApartmentId);
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Manage Availability</h2>
        <p className="text-muted-foreground">
          Block and unblock dates for apartments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Label className="text-sm font-medium">Apartment</Label>
          <div className="mt-2">
            {isApartmentsLoading ? (
              <div className="text-sm text-muted-foreground">Loading...</div>
            ) : (
              <Select
                value={selectedApartmentId?.toString() ?? ""}
                onValueChange={(value) => setSelectedApartmentId(Number(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select apartment" />
                </SelectTrigger>
                <SelectContent>
                  {(apartments ?? []).map((apt) => (
                    <SelectItem key={apt.id} value={apt.id.toString()}>
                      {apt.number} - {apt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Date to block</Label>
              <Input
                type="date"
                value={blockDateValue}
                onChange={(e) => setBlockDateValue(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Reason (optional)</Label>
              <Input
                value={reason}
                placeholder="e.g. Maintenance, Cleaning..."
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Button
              onClick={() => void handleBlock()}
              disabled={
                selectedApartmentId === null ||
                !blockDateValue ||
                blockDateMutation.isPending
              }
            >
              {blockDateMutation.isPending ? "Blocking..." : "Block date"}
            </Button>
            <div className="text-sm text-muted-foreground">
              This will mark the date as unavailable in the public calendar after refresh/month change.
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Blocked dates</Label>
        <div className="mt-3">
          {selectedApartmentId === null ? (
            <div className="text-sm text-muted-foreground">
              Select an apartment to view and manage blocked dates.
            </div>
          ) : isBlockedDatesLoading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : !blockedDates || blockedDates.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No blocked dates yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">ID</th>
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Reason
                    </th>
                    <th className="text-left py-3 px-4 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {blockedDates.map((bd) => (
                    <tr
                      key={bd.id}
                      className="border-b border-border hover:bg-muted/50"
                    >
                      <td className="py-3 px-4">{bd.id}</td>
                      <td className="py-3 px-4">
                        {new Date(bd.date).toLocaleDateString("bg-BG")}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {bd.reason ? bd.reason : "-"}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => void handleUnblock(bd.id)}
                          disabled={unblockDateMutation.isPending}
                        >
                          {unblockDateMutation.isPending
                            ? "Unblocking..."
                            : "Unblock"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

/**
 * Apartments Tab - View apartment information
 */
function ApartmentsTab() {
  const { data: apartments, isLoading } = trpc.admin.apartments.list.useQuery();

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading apartments...</p>
      </div>
    );
  }

  if (!apartments || apartments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No apartments found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {apartments.map((apt) => (
        <Card key={apt.id} className="p-6">
          <h3 className="text-lg font-bold mb-2">{apt.name}</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="font-semibold">Number:</span> {apt.number}
            </p>
            <p>
              <span className="font-semibold">Size:</span> {apt.sqm} м²
            </p>
            <p>
              <span className="font-semibold">Bedrooms:</span> {apt.bedrooms}
            </p>
            <p>
              <span className="font-semibold">Price:</span> {apt.pricePerNight} лв/night
            </p>
            <p>
              <span className="font-semibold">Min Stay:</span> {apt.minNights} nights
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
