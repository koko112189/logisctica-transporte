import { ExternalCarrier } from '../entities/external-carrier.entity';

export interface ExternalCarrierRepositoryPort {
  save(carrier: ExternalCarrier): Promise<void>;
  findById(id: string, tenantId: string): Promise<ExternalCarrier | null>;
  list(tenantId: string, page: number, limit: number, activeOnly: boolean): Promise<{ items: ExternalCarrier[]; total: number }>;
  findByTaxId(taxId: string, tenantId: string): Promise<ExternalCarrier | null>;
}
