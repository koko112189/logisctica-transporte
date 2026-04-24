import { ChecklistCategory } from '../../domain/enums/checklist-category.enum';
import { ChecklistTemplate } from '../../domain/enums/checklist-template.enum';
import { ItemStatus } from '../../domain/enums/item-status.enum';
import { ChecklistItem } from '../../domain/value-objects/checklist-item.vo';

const HEAVY_DEFINITIONS: Array<{ category: ChecklistCategory; name: string }> = [
  { category: ChecklistCategory.ENGINE, name: 'Nivel de aceite motor' },
  { category: ChecklistCategory.ENGINE, name: 'Nivel de refrigerante' },
  { category: ChecklistCategory.ENGINE, name: 'Nivel de líquido de frenos' },
  { category: ChecklistCategory.ENGINE, name: 'Fugas de aceite o combustible' },
  { category: ChecklistCategory.TIRES, name: 'Presión llanta delantera izquierda' },
  { category: ChecklistCategory.TIRES, name: 'Presión llanta delantera derecha' },
  { category: ChecklistCategory.TIRES, name: 'Presión llantas traseras izquierdas' },
  { category: ChecklistCategory.TIRES, name: 'Presión llantas traseras derechas' },
  { category: ChecklistCategory.TIRES, name: 'Estado visual de llantas' },
  { category: ChecklistCategory.BRAKES, name: 'Freno de servicio' },
  { category: ChecklistCategory.BRAKES, name: 'Freno de emergencia' },
  { category: ChecklistCategory.LIGHTS, name: 'Luces delanteras' },
  { category: ChecklistCategory.LIGHTS, name: 'Luces traseras / freno' },
  { category: ChecklistCategory.LIGHTS, name: 'Direccionales' },
  { category: ChecklistCategory.LIGHTS, name: 'Luces de reversa' },
  { category: ChecklistCategory.DOCUMENTS, name: 'SOAT vigente' },
  { category: ChecklistCategory.DOCUMENTS, name: 'Revisión técnico-mecánica' },
  { category: ChecklistCategory.DOCUMENTS, name: 'Tarjeta de propiedad' },
  { category: ChecklistCategory.DOCUMENTS, name: 'Manifiesto de carga' },
  { category: ChecklistCategory.BODY, name: 'Carrocería sin daños visibles' },
  { category: ChecklistCategory.BODY, name: 'Puertas y seguros operativos' },
  { category: ChecklistCategory.BODY, name: 'Espejos retrovisores' },
  { category: ChecklistCategory.EQUIPMENT, name: 'Extintor vigente' },
  { category: ChecklistCategory.EQUIPMENT, name: 'Kit de carreteras' },
  { category: ChecklistCategory.EQUIPMENT, name: 'Botiquín' },
  { category: ChecklistCategory.EQUIPMENT, name: 'Cinturones de seguridad' },
];

const LIGHT_DEFINITIONS: Array<{ category: ChecklistCategory; name: string }> = [
  { category: ChecklistCategory.ENGINE, name: 'Nivel de aceite' },
  { category: ChecklistCategory.ENGINE, name: 'Estado general del motor' },
  { category: ChecklistCategory.TIRES, name: 'Presión y estado de llantas' },
  { category: ChecklistCategory.BRAKES, name: 'Freno operativo' },
  { category: ChecklistCategory.LIGHTS, name: 'Luces operativas' },
  { category: ChecklistCategory.DOCUMENTS, name: 'SOAT vigente' },
  { category: ChecklistCategory.DOCUMENTS, name: 'Licencia de conducción' },
  { category: ChecklistCategory.BODY, name: 'Estado general del vehículo' },
  { category: ChecklistCategory.EQUIPMENT, name: 'Casco / chaleco reflectivo' },
  { category: ChecklistCategory.EQUIPMENT, name: 'Maletín / bolso de entrega' },
];

export function buildDefaultItems(template: ChecklistTemplate): ChecklistItem[] {
  const defs =
    template === ChecklistTemplate.HEAVY_VEHICLE
      ? HEAVY_DEFINITIONS
      : LIGHT_DEFINITIONS;
  return defs.map(
    (d) => new ChecklistItem(d.category, d.name, ItemStatus.NA, null),
  );
}

export function templateFromVehicleType(vehicleType: string): ChecklistTemplate {
  const lightTypes = ['MOTORCYCLE', 'CAR'];
  return lightTypes.includes(vehicleType)
    ? ChecklistTemplate.LIGHT_VEHICLE
    : ChecklistTemplate.HEAVY_VEHICLE;
}
