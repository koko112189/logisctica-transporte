# Plan de Implementación — Calypso TMS Backend

> Stack: NestJS · Hexagonal Architecture · DDD · MongoDB (Mongoose)  
> Patrón base: `domain/` → `application/` → `infrastructure/` → `presentation/`

---

## Estado actual

| Módulo | Estado |
|---|---|
| Auth | ✅ Completo |
| Tenants | ✅ Completo |
| Users (con `UserRole`) | ✅ Completo |
| **Vehicles** | ✅ Completo |
| Checklist | ⬜ Pendiente |
| Appointments | ⬜ Pendiente |
| Trips | ⬜ Pendiente |
| Route Points | ⬜ Pendiente |
| Drivers | ⬜ Pendiente |
| Credit Notes + Liquidation | ⬜ Pendiente |
| Carriers | ⬜ Pendiente |
| Domiciliary | ⬜ Pendiente |
| Warehouses | ⬜ Pendiente |
| Audit | ⬜ Pendiente |

---

## Fases de implementación

```
Fase 2 — Operación diaria
  └── CHECKLIST
  └── APPOINTMENTS

Fase 3 — Ejecución del viaje
  └── ROUTE_POINTS
  └── TRIPS  (incluye TripStop con paradas)
  └── DRIVERS (perfil + encuesta diaria)
  └── CREDIT_NOTES + RATES (entregas por tienda + liquidación)

Fase 4 — Actores externos
  └── CARRIERS
  └── DOMICILIARY
  └── WAREHOUSES

Fase 5 — Transversal
  └── AUDIT
```

---

## Fase 2 — CHECKLIST (`TmsModule.CHECKLIST`)

### Propósito
Checklist diario obligatorio que el conductor debe completar antes de operar el vehículo. El administrador genera el pendiente; el conductor lo llena y envía.

### Entidades

**`DailyChecklist`**
```
id              string
tenantId        string
vehicleId       string
driverId        string
date            Date          (solo fecha, sin hora)
items           ChecklistItem[]
fuelLevel       FuelLevel
previousTasksConfirmed  boolean
generalObservations     string
checklistTemplate       ChecklistTemplate   (HEAVY_VEHICLE | LIGHT_VEHICLE)
status          ChecklistStatus
submittedAt     Date | null
createdAt       Date
```

**Value Objects**
- `ChecklistItem`: `{ category: ChecklistCategory, name, status: ItemStatus, observation? }`
- `ChecklistCategory` enum: `ENGINE | TIRES | BRAKES | LIGHTS | DOCUMENTS | BODY | EQUIPMENT`
- `ItemStatus` enum: `OK | NOK | NA`
- `FuelLevel` enum: `FULL | THREE_QUARTERS | HALF | ONE_QUARTER | EMPTY`
- `ChecklistTemplate` enum: `HEAVY_VEHICLE | LIGHT_VEHICLE`
- `ChecklistStatus` enum: `PENDING | COMPLETED | MISSED`

**Items predefinidos por template**

| HEAVY_VEHICLE | LIGHT_VEHICLE |
|---|---|
| Motor / fluidos | Motor |
| Llantas (6) | Llantas (2) |
| Frenos | Frenos |
| Luces | Luces |
| Documentos (soat, revisión) | Documentos |
| Carrocería / puertas | Carrocería |
| Extintores / kit emergencia | — |
| Cinturones / espejos | Casco / chaleco |

### Use Cases

| Use Case | Tipo | Actor |
|---|---|---|
| `CreateDailyChecklist` | Command | Admin / scheduler |
| `SubmitChecklist` | Command | Conductor |
| `GetChecklistById` | Query | Admin / Conductor |
| `GetChecklistByVehicleAndDate` | Query | Admin / Conductor |
| `ListChecklists` | Query | Admin |
| `GetPendingChecklistsForDriver` | Query | Conductor |

### Endpoints

```
POST   /checklists                             → CreateDailyChecklist
PATCH  /checklists/:id/submit                  → SubmitChecklist (body: items[], fuelLevel, previousTasksConfirmed, generalObservations)
GET    /checklists/:id                         → GetChecklistById
GET    /checklists/vehicle/:vehicleId/date/:date → GetChecklistByVehicleAndDate
GET    /checklists                             → ListChecklists (filtros: vehicleId, driverId, status, from, to)
GET    /checklists/pending                     → GetPendingChecklistsForDriver (conductor autenticado)
```

### Errores de dominio
```
CHECKLIST_NOT_FOUND         → 404
CHECKLIST_ALREADY_SUBMITTED → 409
CHECKLIST_ALREADY_EXISTS    → 409  (ya existe uno para ese vehicleId+date)
```

### Relación con otros módulos
- Al crear un `Trip` (Fase 3) se verifica que el conductor tenga checklist `COMPLETED` para ese día antes de marcar `IN_TRANSIT`.
- `checklistTemplate` se hereda del tipo de vehículo (`HEAVY_VEHICLE` para TRUCK/VAN/TRAILER, `LIGHT_VEHICLE` para MOTORCYCLE/CAR).

---

## Fase 2 — APPOINTMENTS (`TmsModule.APPOINTMENTS`)

### Propósito
Agendamiento de rutas con vista de calendario. Al crear o reprogramar una cita, el sistema notifica al conductor por email.

### Entidades

**`Appointment`**
```
id              string
tenantId        string
vehicleId       string
driverId        string
title           string
description     string
origin          LocationVO
destination     LocationVO
scheduledAt     Date
estimatedDurationMinutes  number
status          AppointmentStatus
notificationSentAt  Date | null
createdAt       Date
updatedAt       Date
```

**Value Objects**
- `LocationVO`: `{ address, city, lat?: number, lng?: number }`
- `AppointmentStatus` enum: `SCHEDULED | IN_PROGRESS | COMPLETED | CANCELLED`

### Use Cases

| Use Case | Tipo | Nota |
|---|---|---|
| `CreateAppointment` | Command | Dispara email al conductor |
| `UpdateAppointment` | Command | Si cambia fecha, re-notifica |
| `CancelAppointment` | Command | — |
| `StartAppointment` | Command | Marca IN_PROGRESS |
| `CompleteAppointment` | Command | — |
| `GetAppointmentById` | Query | — |
| `ListAppointments` | Query | Filtros de calendario |

### Endpoints

```
POST   /appointments                           → CreateAppointment
GET    /appointments                           → ListAppointments (filtros: vehicleId, driverId, from, to, status)
GET    /appointments/:id                       → GetAppointmentById
PATCH  /appointments/:id                       → UpdateAppointment
DELETE /appointments/:id                       → CancelAppointment
PATCH  /appointments/:id/start                 → StartAppointment
PATCH  /appointments/:id/complete              → CompleteAppointment
GET    /appointments/driver/upcoming           → citas próximas del conductor autenticado
```

### Errores de dominio
```
APPOINTMENT_NOT_FOUND    → 404
APPOINTMENT_CANCELLED    → 409  (no se puede operar una cita cancelada)
VEHICLE_UNAVAILABLE      → 409  (vehículo en MAINTENANCE o INACTIVE)
```

### Notificaciones
- Inyectar `INotificationService` (port ya definido en `src/shared/domain/ports/notification.service.port.ts`)
- Implementar `EmailNotificationService` en `src/shared/infrastructure/notifications/email.notification.service.ts` usando **nodemailer**
- Registrar en un `NotificationsModule` y exportar para uso en Appointments y Warehouses

---

## Fase 3 — ROUTE_POINTS (`TmsModule.ROUTE_POINTS`)

### Propósito
Catálogo maestro de puntos de recogida/entrega (tiendas, bodegas, hubs). Los administradores gestionan el catálogo; al crear un viaje se seleccionan paradas ordenadas de este catálogo.

### Entidades

**`PickupPoint`**
```
id              string
tenantId        string
name            string        (nombre de la tienda / bodega)
type            PickupPointType
address         string
city            string
postalCode      string | null
coordinates     CoordinatesVO
contactName     string | null
contactPhone    string | null
contactEmail    string | null
operatingHours  string | null
isActive        boolean
createdAt       Date
updatedAt       Date
```

**Value Objects**
- `CoordinatesVO`: `{ lat: number, lng: number }`
- `PickupPointType` enum: `ORIGIN | DELIVERY | BOTH`

### Use Cases

| Use Case | Tipo |
|---|---|
| `CreatePickupPoint` | Command |
| `UpdatePickupPoint` | Command |
| `DeactivatePickupPoint` | Command |
| `GetPickupPointById` | Query |
| `ListPickupPoints` | Query (filtros: type, city, isActive) |

### Endpoints

```
POST   /route-points                           → CreatePickupPoint
GET    /route-points                           → ListPickupPoints
GET    /route-points/:id                       → GetPickupPointById
PATCH  /route-points/:id                       → UpdatePickupPoint
DELETE /route-points/:id                       → DeactivatePickupPoint (soft)
```

### Errores de dominio
```
PICKUP_POINT_NOT_FOUND  → 404
```

---

## Fase 3 — TRIPS (`TmsModule.TRIPS`)

### Propósito
Panel operativo de rastreo de flota en tiempo real. Orquesta Appointment + Checklist + GPS. Incluye paradas ordenadas (TripStop) para la travesía visual del conductor.

### Extensión al módulo VEHICLES
Agregar al `Trip` el campo `vehicleCategory: VehicleCategory` para diferenciar flota ligera de pesada.

**`VehicleCategory`** enum: `HEAVY | LIGHT`

### Entidades

**`Trip`**
```
id                  string
tenantId            string
vehicleId           string
driverId            string
appointmentId       string | null
vehicleCategory     VehicleCategory
isExternalCarrier   boolean
domiciliaryId       string | null
origin              LocationVO
destination         LocationVO
stops               TripStop[]
startedAt           Date | null
estimatedArrival    Date | null
actualArrival       Date | null
currentLocation     CoordinatesVO | null
lastLocationUpdatedAt  Date | null
status              TripStatus
checklistComplied   boolean
auditLog            TripAuditEntry[]
createdAt           Date
updatedAt           Date
```

**Value Objects**
- `TripStop`: `{ stopOrder, pickupPointId, type: StopType, scheduledArrival?, actualArrival?, status: StopStatus, notes?, storeDeliveryId? }`
- `StopType` enum: `PICKUP | DELIVERY`
- `StopStatus` enum: `PENDING | ARRIVED | COMPLETED | SKIPPED`
- `TripStatus` enum: `PENDING | IN_TRANSIT | DELAYED | COMPLETED | CANCELLED`
- `TripAuditEntry`: `{ timestamp, event: TripEvent, description, metadata?, performedByUserId? }`
- `TripEvent` enum: `CREATED | STARTED | LOCATION_UPDATE | STOP_ARRIVED | STOP_COMPLETED | CHECKLIST_VERIFIED | DELAY_REPORTED | INCIDENT | COMPLETED | CANCELLED`

### Use Cases

| Use Case | Tipo | Nota |
|---|---|---|
| `CreateTrip` | Command | Puede venir de un Appointment |
| `StartTrip` | Command | Verifica checklist del día |
| `UpdateTripLocation` | Command | Endpoint GPS del vehículo |
| `ArriveAtStop` | Command | Conductor marca llegada a parada |
| `CompleteStop` | Command | Conductor confirma entrega/recogida |
| `ReportDelay` | Command | — |
| `CompleteTrip` | Command | — |
| `CancelTrip` | Command | — |
| `GetTripById` | Query | — |
| `GetActiveTripByVehicle` | Query | — |
| `ListTrips` | Query | Filtros admin |
| `GetTripRoute` | Query | Paradas ordenadas con coords (vista conductor) |

### Endpoints

```
POST   /trips                                  → CreateTrip
GET    /trips                                  → ListTrips (filtros: vehicleId, driverId, status, from, to, vehicleCategory)
GET    /trips/active                           → ListActiveTrips
GET    /trips/:id                              → GetTripById
GET    /trips/:id/route                        → GetTripRoute (paradas con coords — vista conductor)
PATCH  /trips/:id/start                        → StartTrip
PATCH  /trips/:id/location                     → UpdateTripLocation (GPS)
PATCH  /trips/:id/stops/:order/arrive          → ArriveAtStop
PATCH  /trips/:id/stops/:order/complete        → CompleteStop
PATCH  /trips/:id/delay                        → ReportDelay
PATCH  /trips/:id/complete                     → CompleteTrip
DELETE /trips/:id                              → CancelTrip
GET    /trips/:id/audit                        → GetTripAudit
GET    /trips/driver/active                    → viaje activo del conductor autenticado
```

### Errores de dominio
```
TRIP_NOT_FOUND           → 404
TRIP_ALREADY_STARTED     → 409
TRIP_CHECKLIST_MISSING   → 422  (conductor no subió checklist del día)
STOP_NOT_FOUND           → 404
STOP_ALREADY_COMPLETED   → 409
```

---

## Fase 3 — DRIVERS (`TmsModule.DRIVERS`)

### Propósito
Perfil extendido del conductor (complementa al User) + encuesta diaria de estado operativo del vehículo, confirmación de entregas e incidentes.

### Entidades

**`DriverProfile`**
```
id              string
tenantId        string
userId          string        (ref → User con role=DRIVER)
licenseNumber   string
licenseExpiry   Date
assignedVehicleId  string | null
isActive        boolean
createdAt       Date
updatedAt       Date
```

**`DriverSurvey`** (encuesta diaria)
```
id              string
tenantId        string
driverId        string        (ref → DriverProfile)
vehicleId       string
date            Date
vehicleState    VehicleStateLevel
deliveredItems  DeliveredItem[]
incidents       Incident[]
chemicalsHandled    boolean
chemicalsDelivered  boolean | null
observations    string
status          SurveyStatus
submittedAt     Date | null
createdAt       Date
```

**Value Objects**
- `VehicleStateLevel` enum: `EXCELLENT | GOOD | FAIR | POOR | CRITICAL`
- `DeliveredItem`: `{ name, quantity, unit?, confirmed: boolean, observations? }`
- `Incident`: `{ type: IncidentType, description, severity: IncidentSeverity }`
- `IncidentType` enum: `ACCIDENT | MECHANICAL | DELAY | THEFT | WEATHER | OTHER`
- `IncidentSeverity` enum: `LOW | MEDIUM | HIGH`
- `SurveyStatus` enum: `PENDING | COMPLETED`

### Use Cases

**DriverProfile**

| Use Case | Tipo |
|---|---|
| `CreateDriverProfile` | Command |
| `UpdateDriverProfile` | Command |
| `AssignVehicleToDriver` | Command |
| `GetDriverProfile` | Query |
| `ListDriverProfiles` | Query |

**DriverSurvey**

| Use Case | Tipo | Nota |
|---|---|---|
| `CreateDriverSurvey` | Command | Admin genera el pendiente diario |
| `SubmitDriverSurvey` | Command | Conductor completa |
| `GetDriverSurveyById` | Query | — |
| `ListDriverSurveys` | Query | Filtros: driverId, dateRange, status |
| `GetPendingSurveysForDriver` | Query | Vista conductor |

### Endpoints

```
POST   /drivers                                → CreateDriverProfile
GET    /drivers                                → ListDriverProfiles
GET    /drivers/:id                            → GetDriverProfile
PATCH  /drivers/:id                            → UpdateDriverProfile
PATCH  /drivers/:id/assign-vehicle             → AssignVehicleToDriver
POST   /drivers/:id/surveys                    → CreateDriverSurvey
PATCH  /drivers/:id/surveys/:surveyId/submit   → SubmitDriverSurvey
GET    /drivers/:id/surveys                    → ListDriverSurveys
GET    /drivers/surveys/pending                → GetPendingSurveysForDriver (conductor autenticado)
```

### Errores de dominio
```
DRIVER_PROFILE_NOT_FOUND  → 404
SURVEY_NOT_FOUND          → 404
SURVEY_ALREADY_SUBMITTED  → 409
```

---

## Fase 3 — CREDIT_NOTES + RATES (Liquidación de Viaje)

### Propósito
Registro de valor de mercancía e insumos por cada parada de entrega dentro de un viaje. Liquidación total que suma mercancía, gastos de viaje y comisiones.

### Módulos en TmsModule
- `CREDIT_NOTES` → notas de crédito por tienda
- `RATES` → liquidación, gastos y comisiones del viaje

### Entidades

**`StoreDelivery`** (una por cada parada de entrega)
```
id              string
tenantId        string
tripId          string
tripStopOrder   number        (referencia a la parada en el viaje)
pickupPointId   string
supplies        SupplyItem[]
merchandiseValue  number
creditNoteId    string | null
status          DeliveryStatus
observations    string
deliveredAt     Date | null
receivedByName  string | null
createdAt       Date
updatedAt       Date
```

**`CreditNote`**
```
id              string
tenantId        string
tripId          string
storeDeliveryId string
number          string        (folio autogenerado)
reason          string
items           CreditNoteItem[]
totalAmount     number
issuedAt        Date
status          CreditNoteStatus
createdAt       Date
```

**`TripLiquidation`**
```
id                    string
tenantId              string
tripId                string
totalMerchandiseValue number      (suma de StoreDeliveries)
travelExpenses        Expense[]
suppliesConsumed      SupplyConsumed[]
driverCommission      number
otherCommissions      Commission[]
totalExpenses         number      (calculado)
totalCommissions      number      (calculado)
netValue              number      (totalMerchandise - totalExpenses - totalCommissions)
status                LiquidationStatus
approvedByUserId      string | null
approvedAt            Date | null
createdAt             Date
updatedAt             Date
```

**Value Objects**
- `SupplyItem`: `{ name, quantity, unit, unitValue, totalValue }`
- `CreditNoteItem`: `{ description, quantity, unitValue, totalValue }`
- `Expense`: `{ type: ExpenseType, description, amount, receiptUrl? }`
- `ExpenseType` enum: `FUEL | TOLL | FOOD | PARKING | OTHER`
- `SupplyConsumed`: `{ name, quantity, unit, unitCost, total }`
- `Commission`: `{ description, amount }`
- `DeliveryStatus` enum: `PENDING | DELIVERED | PARTIAL | RETURNED`
- `CreditNoteStatus` enum: `DRAFT | ISSUED | CANCELLED`
- `LiquidationStatus` enum: `DRAFT | SUBMITTED | APPROVED | REJECTED`

### Use Cases

**StoreDelivery**

| Use Case | Tipo |
|---|---|
| `CreateStoreDelivery` | Command |
| `CompleteDelivery` | Command |
| `MarkPartialDelivery` | Command |
| `GetStoreDelivery` | Query |
| `ListStoreDeliveries` | Query |

**CreditNote**

| Use Case | Tipo |
|---|---|
| `CreateCreditNote` | Command |
| `IssueCreditNote` | Command |
| `CancelCreditNote` | Command |
| `GetCreditNote` | Query |

**TripLiquidation**

| Use Case | Tipo |
|---|---|
| `CreateTripLiquidation` | Command |
| `AddExpenseToLiquidation` | Command |
| `SubmitLiquidation` | Command |
| `ApproveLiquidation` | Command |
| `RejectLiquidation` | Command |
| `GetLiquidationByTrip` | Query |
| `ListLiquidations` | Query |

### Endpoints

```
POST   /trips/:id/deliveries                              → CreateStoreDelivery
GET    /trips/:id/deliveries                              → ListStoreDeliveries
PATCH  /trips/:id/deliveries/:deliveryId/complete         → CompleteDelivery
PATCH  /trips/:id/deliveries/:deliveryId/partial          → MarkPartialDelivery
POST   /trips/:id/deliveries/:deliveryId/credit-note      → CreateCreditNote
PATCH  /trips/:id/deliveries/:deliveryId/credit-note/issue → IssueCreditNote
POST   /trips/:id/liquidation                             → CreateTripLiquidation
GET    /trips/:id/liquidation                             → GetLiquidationByTrip
PATCH  /trips/:id/liquidation/expenses                    → AddExpenseToLiquidation
PATCH  /trips/:id/liquidation/submit                      → SubmitLiquidation
PATCH  /trips/:id/liquidation/approve                     → ApproveLiquidation
PATCH  /trips/:id/liquidation/reject                      → RejectLiquidation
GET    /liquidations                                      → ListLiquidations (admin)
```

### Errores de dominio
```
STORE_DELIVERY_NOT_FOUND   → 404
LIQUIDATION_NOT_FOUND      → 404
LIQUIDATION_ALREADY_EXISTS → 409
CREDIT_NOTE_NOT_FOUND      → 404
```

---

## Fase 4 — CARRIERS (`TmsModule.CARRIERS`)

### Propósito
Gestión de transportadoras externas. Los viajes asignados a un carrier siguen el mismo flujo operativo (checklist + paradas + liquidación) con `isExternalCarrier=true` en Trip.

### Entidades

**`ExternalCarrier`** (empresa)
```
id              string
tenantId        string
companyName     string
nit             string
contactName     string
contactPhone    string
contactEmail    string
isActive        boolean
createdAt       Date
updatedAt       Date
```

**`ExternalVehicle`** (vehículo del tercero)
```
id              string
tenantId        string
carrierId       string
licensePlate    string
vehicleType     VehicleType
driverName      string
driverPhone     string
driverLicense   string
currentLocation CoordinatesVO | null
isActive        boolean
createdAt       Date
updatedAt       Date
```

### Use Cases

| Use Case | Tipo |
|---|---|
| `CreateExternalCarrier` | Command |
| `UpdateExternalCarrier` | Command |
| `DeactivateExternalCarrier` | Command |
| `GetExternalCarrierById` | Query |
| `ListExternalCarriers` | Query |
| `RegisterExternalVehicle` | Command |
| `UpdateExternalVehicleLocation` | Command |
| `ListExternalVehicles` | Query |
| `AssignTripToExternalVehicle` | Command — crea Trip con `isExternalCarrier=true` |

### Endpoints

```
POST   /carriers                                    → CreateExternalCarrier
GET    /carriers                                    → ListExternalCarriers
GET    /carriers/:id                                → GetExternalCarrierById
PATCH  /carriers/:id                                → UpdateExternalCarrier
DELETE /carriers/:id                                → DeactivateExternalCarrier
POST   /carriers/:id/vehicles                       → RegisterExternalVehicle
GET    /carriers/:id/vehicles                       → ListExternalVehicles
PATCH  /carriers/:id/vehicles/:vehicleId/location   → UpdateExternalVehicleLocation
POST   /carriers/:id/vehicles/:vehicleId/trips       → AssignTripToExternalVehicle
```

### Errores de dominio
```
CARRIER_NOT_FOUND          → 404
EXTERNAL_VEHICLE_NOT_FOUND → 404
CARRIER_PLATE_DUPLICATE    → 409
```

---

## Fase 4 — DOMICILIARY (`TmsModule.DOMICILIARY`)

### Propósito
Domiciliarios externos (motos, bicicletas, autos ligeros) para entregas entre puntos de venta cercanos. Mismo rigor operativo que flota pesada — diferenciados por `vehicleCategory=LIGHT` en Trip y template `LIGHT_VEHICLE` en Checklist.

### Entidades

**`Domiciliary`**
```
id              string
tenantId        string
userId          string | null     (User con role=DRIVER si tiene acceso al sistema)
name            string
phone           string
idDocument      string
vehicleType     LightVehicleType
licensePlate    string | null
vehicleModel    string | null
isActive        boolean
createdAt       Date
updatedAt       Date
```

**Value Objects**
- `LightVehicleType` enum: `MOTORCYCLE | BICYCLE | LIGHT_CAR`

### Integración con módulos existentes
- Los viajes de domiciliario usan `Trip` con `vehicleCategory=LIGHT`, `isExternalCarrier=true`, `domiciliaryId` poblado.
- Los checklists usan `checklistTemplate=LIGHT_VEHICLE`.
- Las encuestas usan `DriverSurvey` del módulo DRIVERS.

### Use Cases

| Use Case | Tipo |
|---|---|
| `RegisterDomiciliary` | Command |
| `UpdateDomiciliary` | Command |
| `DeactivateDomiciliary` | Command |
| `GetDomiciliaryById` | Query |
| `ListDomiciliaries` | Query |
| `AssignDomiciliaryTrip` | Command — crea Trip con flags LIGHT |
| `GetActiveTripForDomiciliary` | Query |

### Endpoints

```
POST   /domiciliaries                          → RegisterDomiciliary
GET    /domiciliaries                          → ListDomiciliaries (filtros: vehicleType, isActive)
GET    /domiciliaries/:id                      → GetDomiciliaryById
PATCH  /domiciliaries/:id                      → UpdateDomiciliary
DELETE /domiciliaries/:id                      → DeactivateDomiciliary
POST   /domiciliaries/:id/trips                → AssignDomiciliaryTrip
GET    /domiciliaries/:id/trips                → ListDomiciliaryTrips
GET    /domiciliaries/:id/trips/active         → GetActiveTripForDomiciliary
```

### Errores de dominio
```
DOMICILIARY_NOT_FOUND  → 404
```

---

## Fase 4 — WAREHOUSES (`TmsModule.WAREHOUSES`)

### Propósito
Gestión de bodegas de destino. El sistema envía emails automáticos al avanzar el viaje (salida, proximidad, llegada). El usuario con rol `WAREHOUSE` confirma la recepción desde el sistema.

### Entidades

**`Warehouse`**
```
id              string
tenantId        string
name            string
address         string
city            string
contactEmail    string
contactPhone    string
contactName     string
linkedUserId    string | null     (User con role=WAREHOUSE)
isActive        boolean
createdAt       Date
updatedAt       Date
```

**`DeliveryNotification`**
```
id                  string
tenantId            string
warehouseId         string
tripId              string
type                NotificationType
emailSentTo         string
sentAt              Date
confirmedAt         Date | null
confirmedByUserId   string | null
observations        string | null
createdAt           Date
```

**Value Objects**
- `NotificationType` enum: `DEPARTURE | PROXIMITY | ARRIVED | DELIVERED`

### Flujo de notificaciones
```
Trip.start()     → DEPARTURE  → email a bodega
Trip.proximity() → PROXIMITY  → email a bodega (cuando GPS está a N km)
Trip.complete()  → ARRIVED    → email a bodega
Warehouse confirm → DELIVERED  → confirmación en sistema
```

### Use Cases

| Use Case | Tipo | Nota |
|---|---|---|
| `CreateWarehouse` | Command | — |
| `UpdateWarehouse` | Command | — |
| `DeactivateWarehouse` | Command | — |
| `CreateWarehouseUser` | Command | Crea User con role=WAREHOUSE |
| `GetWarehouseById` | Query | — |
| `ListWarehouses` | Query | — |
| `SendDeliveryNotification` | Command | Disparado internamente por Trip events |
| `ConfirmDelivery` | Command | Actor: usuario Bodega |
| `ListDeliveryNotifications` | Query | — |

### Endpoints

```
POST   /warehouses                                        → CreateWarehouse
GET    /warehouses                                        → ListWarehouses
GET    /warehouses/:id                                    → GetWarehouseById
PATCH  /warehouses/:id                                    → UpdateWarehouse
DELETE /warehouses/:id                                    → DeactivateWarehouse
POST   /warehouses/:id/users                              → CreateWarehouseUser
POST   /warehouses/:id/notifications                      → SendDeliveryNotification (interno)
PATCH  /warehouses/:id/notifications/:notificationId/confirm → ConfirmDelivery
GET    /warehouses/:id/notifications                      → ListDeliveryNotifications
```

### Errores de dominio
```
WAREHOUSE_NOT_FOUND              → 404
NOTIFICATION_NOT_FOUND           → 404
NOTIFICATION_ALREADY_CONFIRMED   → 409
```

---

## Fase 5 — AUDIT (`TmsModule.AUDIT`)

### Propósito
Registro cronológico de todos los cambios y eventos del sistema. El administrador puede ver el timeline de cualquier recurso y un dashboard de novedades (retrasos, incidentes, cambios de asignación).

### Diseño (sin acoplamiento directo)

```
Cada módulo → publica NestJS Event (EventEmitter2)
AuditModule → @OnEvent('*') escucha todos → persiste AuditLog
```

Instalar: `@nestjs/event-emitter`

### Entidades

**`AuditLog`**
```
id                  string
tenantId            string
entityType          AuditEntityType
entityId            string
event               AuditEvent
description         string
metadata            Record<string, unknown>   (before/after, coords, monto, etc.)
performedByUserId   string | null
performedByRole     UserRole | null
performedAt         Date
severity            AuditSeverity
```

**Value Objects**
- `AuditEntityType` enum: `VEHICLE | TRIP | CHECKLIST | APPOINTMENT | STORE_DELIVERY | LIQUIDATION | DRIVER | CARRIER | WAREHOUSE | DOMICILIARY | USER`
- `AuditEvent` enum: `CREATED | UPDATED | DELETED | STATUS_CHANGED | LOCATION_UPDATED | STOP_ARRIVED | STOP_COMPLETED | DELIVERY_CONFIRMED | CHECKLIST_SUBMITTED | SURVEY_SUBMITTED | DELAY_REPORTED | INCIDENT_REPORTED | APPROVED | REJECTED | CANCELLED | NOTIFICATION_SENT`
- `AuditSeverity` enum: `INFO | WARNING | CRITICAL`

### Use Cases

| Use Case | Tipo | Nota |
|---|---|---|
| `LogAuditEvent` | Command | Interno, llamado por EventBus |
| `GetEntityTimeline` | Query | Timeline de un recurso |
| `ListAuditLogs` | Query | Dashboard admin |

### Endpoints

```
GET    /audit/:entityType/:entityId            → timeline cronológico de un recurso
GET    /audit                                  → dashboard admin (filtros: entityType, event, severity, from, to, userId)
```

### Errores de dominio
Ninguno expuesto al cliente — es solo lectura y escritura interna.

---

## Módulo transversal: NotificationsModule

Instalar: `npm install nodemailer && npm install -D @types/nodemailer`

### Estructura
```
src/shared/infrastructure/notifications/
  email.notification.service.ts    (implements INotificationService)
src/shared/notifications.module.ts (exporta NotificationsModule con EmailNotificationService)
```

### Variables de entorno a agregar al `.env`
```
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=noreply@calypso.co
MAIL_PASS=secret
MAIL_FROM="Calypso TMS <noreply@calypso.co>"
```

`NotificationsModule` se importa en `AppModule` y se exporta globalmente. Los módulos que necesiten notificar (Appointments, Warehouses) lo inyectan vía `INotificationService`.

---

## Resumen de archivos por módulo (estimado)

| Módulo | Archivos nuevos |
|---|---|
| CHECKLIST | ~18 |
| APPOINTMENTS + Notifications | ~20 |
| ROUTE_POINTS | ~12 |
| TRIPS | ~25 |
| DRIVERS | ~22 |
| CREDIT_NOTES + RATES | ~28 |
| CARRIERS | ~20 |
| DOMICILIARY | ~14 |
| WAREHOUSES | ~20 |
| AUDIT | ~14 |
| **Total estimado** | **~193** |

---

## Convenciones a mantener en todos los módulos

1. **Entidad inmutable**: toda operación retorna nueva instancia con método `with*()`.
2. **Repository**: siempre filtrar por `tenantId` — los datos son estrictamente tenant-scoped.
3. **Controller**: método privado `requireTenantId(caller)` que lanza `ForbiddenException` si falta.
4. **Errores**: agregar códigos al `statusByCode` en `DomainExceptionFilter` antes de cada módulo.
5. **Módulo que depende de otro**: importar el módulo completo (ej: `VehiclesModule`) y usar el use case exportado.
6. **DI token**: siempre un archivo `{module}.di-tokens.ts` con el string del repositorio.
7. **Schema**: índice compuesto `{ tenantId, [campo-único] }` para garantizar unicidad por tenant.
8. **Swagger**: todos los DTOs con `@ApiProperty`. Response DTOs como clases, no interfaces.
