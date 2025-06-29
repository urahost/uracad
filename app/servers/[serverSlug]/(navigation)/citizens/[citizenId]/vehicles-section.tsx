"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Citizen, Vehicle } from "@prisma/client";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import CheckPermission from "../../permissions/check-permissions";
import { useTranslations } from "next-intl";

export default function VehiclesSection({
  vehicles,
  citizen,
  serverSlug,
}: {
  vehicles: Vehicle[];
  citizen: Citizen;
  serverSlug: string;
}) {
  const t = useTranslations("Vehicles");
  const tCommon = useTranslations("Common");
  
  const citizenId = citizen.id;
  const addVehicleHref = `/servers/${serverSlug}/citizens/${citizenId}/add-vehicle`;


  return (

    <Card className="md:col-span-3">

      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("title")}</CardTitle>
        <CheckPermission permissions="CREATE_VEHICLE">
          <Button asChild>
            <Link href={addVehicleHref}>
              <PlusIcon className="h-4 w-4" />

              {t("addVehicle")}
            </Link>
          </Button>
        </CheckPermission>
      </CardHeader>
      <CardContent>
        {vehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <p className="text-center text-muted-foreground">
              {t("noVehicles")}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("details.makeModel")}</TableHead>
                <TableHead>{t("details.licensePlate")}</TableHead>
                <TableHead>VIN</TableHead>
                <CheckPermission 
                  permissions={["EDIT_VEHICLE", "DELETE_VEHICLE"]} 
                  mode="OR"
                >
                  <TableHead className="text-right">{tCommon("actions")}</TableHead>
                </CheckPermission>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.vehicle}</TableCell>
                  <TableCell>{vehicle.plate}</TableCell>
                  <TableCell>{vehicle.vin ?? "-"}</TableCell>
                  <CheckPermission 
                    permissions={["EDIT_VEHICLE", "DELETE_VEHICLE"]} 
                    mode="OR"
                  >
                    <TableCell className="text-right space-x-2">
                      <CheckPermission permissions="EDIT_VEHICLE">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-8 w-8"
                        >
                          <Link
                            href={`/servers/${serverSlug}/citizens/${citizenId}/vehicles/${vehicle.id}/edit`}
                          >
                            <PencilIcon className="h-4 w-4" />
                            <span className="sr-only">{t("editVehicle")}</span>
                          </Link>
                        </Button>
                      </CheckPermission>
                      <CheckPermission permissions="DELETE_VEHICLE">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Link
                            href={`/servers/${serverSlug}/citizens/${citizenId}/vehicles/${vehicle.id}/delete`}
                          >
                            <TrashIcon className="h-4 w-4" />
                            <span className="sr-only">{t("deleteVehicle")}</span>
                          </Link>
                        </Button>
                      </CheckPermission>
                    </TableCell>
                  </CheckPermission>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
} 