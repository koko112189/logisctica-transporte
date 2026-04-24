export const CalypsoEvents = {
  TRIP_CREATED: 'calypso.trip.created',
  CARRIER_CREATED: 'calypso.carrier.created',
  EXTERNAL_VEHICLE_CREATED: 'calypso.external-vehicle.created',
  DOMICILIARY_CREATED: 'calypso.domiciliary.created',
  WAREHOUSE_CREATED: 'calypso.warehouse.created',
} as const;

export type CalypsoEventName = (typeof CalypsoEvents)[keyof typeof CalypsoEvents];
