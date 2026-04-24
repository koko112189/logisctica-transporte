import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { DomainError } from '../../domain/errors/domain.error';

const statusByCode: Record<string, HttpStatus> = {
  USER_NOT_FOUND: HttpStatus.NOT_FOUND,
  USER_ALREADY_EXISTS: HttpStatus.CONFLICT,
  TENANT_NOT_FOUND: HttpStatus.NOT_FOUND,
  TENANT_ALREADY_EXISTS: HttpStatus.CONFLICT,
  TENANT_INACTIVE: HttpStatus.FORBIDDEN,
  INVALID_CREDENTIALS: HttpStatus.UNAUTHORIZED,
  TOKEN_EXPIRED: HttpStatus.UNAUTHORIZED,
  TOKEN_INVALID: HttpStatus.UNAUTHORIZED,
  USER_INACTIVE: HttpStatus.FORBIDDEN,
  // Vehicles
  VEHICLE_NOT_FOUND: HttpStatus.NOT_FOUND,
  VEHICLE_PLATE_DUPLICATE: HttpStatus.CONFLICT,
  DEFECT_NOT_FOUND: HttpStatus.NOT_FOUND,
  // Checklists
  CHECKLIST_NOT_FOUND: HttpStatus.NOT_FOUND,
  CHECKLIST_ALREADY_SUBMITTED: HttpStatus.CONFLICT,
  CHECKLIST_ALREADY_EXISTS: HttpStatus.CONFLICT,
  VEHICLE_HAS_NO_DRIVER: HttpStatus.UNPROCESSABLE_ENTITY,
  // Appointments
  APPOINTMENT_NOT_FOUND: HttpStatus.NOT_FOUND,
  APPOINTMENT_CANCELLED: HttpStatus.CONFLICT,
  VEHICLE_UNAVAILABLE: HttpStatus.CONFLICT,
  // Route Points
  PICKUP_POINT_NOT_FOUND: HttpStatus.NOT_FOUND,
  // Trips
  TRIP_NOT_FOUND: HttpStatus.NOT_FOUND,
  TRIP_ALREADY_STARTED: HttpStatus.CONFLICT,
  TRIP_CHECKLIST_MISSING: HttpStatus.UNPROCESSABLE_ENTITY,
  STOP_NOT_FOUND: HttpStatus.NOT_FOUND,
  STOP_ALREADY_COMPLETED: HttpStatus.CONFLICT,
  // Drivers
  DRIVER_PROFILE_NOT_FOUND: HttpStatus.NOT_FOUND,
  SURVEY_NOT_FOUND: HttpStatus.NOT_FOUND,
  SURVEY_ALREADY_SUBMITTED: HttpStatus.CONFLICT,
  // Liquidation
  STORE_DELIVERY_NOT_FOUND: HttpStatus.NOT_FOUND,
  LIQUIDATION_NOT_FOUND: HttpStatus.NOT_FOUND,
  LIQUIDATION_ALREADY_EXISTS: HttpStatus.CONFLICT,
  CREDIT_NOTE_NOT_FOUND: HttpStatus.NOT_FOUND,
};

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = statusByCode[exception.code] ?? HttpStatus.BAD_REQUEST;
    response.status(status).json({
      code: exception.code,
      message: exception.message,
    });
  }
}
