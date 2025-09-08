// Common types used across the application
export type UserRole = 'operator' | 'qc_inspector' | 'warehouse_staff' | 'leader' | 'manager';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  department: string;
  shift?: 'morning' | 'afternoon' | 'night';
}

// Production Management Types
export interface ProductionOrder extends BaseEntity {
  poNumber: string;
  customerName: string;
  customerPO?: string;
  productName: string;
  productCode: string;
  quantity: number;
  unit: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  bomId?: string;
  notes?: string;
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: string;
}

export interface BillOfMaterials extends BaseEntity {
  bomCode: string;
  productName: string;
  productCode: string;
  version: string;
  status: 'active' | 'inactive' | 'draft';
  materials: BOMItem[];
  totalCost?: number;
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: string;
}

export interface BOMItem {
  id: string;
  materialCode: string;
  materialName: string;
  specification: string;
  quantity: number;
  unit: string;
  unitCost?: number;
  totalCost?: number;
  supplier?: string;
  notes?: string;
}

export interface MachineReport extends BaseEntity {
  reportNumber: string;
  poId: string;
  machineId: string;
  machineName: string;
  operatorId: string;
  operatorName: string;
  shift: 'morning' | 'afternoon' | 'night';
  date: string;
  setupTime: number; // minutes
  runTime: number; // minutes
  outputQuantity: number;
  scrapQuantity: number;
  defectQuantity: number;
  downtime?: number; // minutes
  downtimeReason?: string;
  qcFeedback?: string;
  notes?: string;
  status: 'in_progress' | 'completed' | 'on_hold';
}

export interface WorkOrder extends BaseEntity {
  workOrderNumber: string;
  poId: string;
  processStep: string;
  machineId: string;
  operatorId: string;
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  priority: number;
  notes?: string;
}

// Quality Control Types
export interface QCInspection extends BaseEntity {
  inspectionNumber: string;
  type: 'incoming' | 'in_process' | 'final';
  poId?: string;
  materialId?: string;
  productId?: string;
  inspectorId: string;
  inspectorName: string;
  inspectionDate: string;
  sampleSize: number;
  passedQuantity: number;
  failedQuantity: number;
  defectTypes: DefectRecord[];
  overallResult: 'pass' | 'fail' | 'conditional';
  notes?: string;
  correctiveActions?: string;
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: string;
}

export interface DefectRecord {
  defectType: string;
  defectDescription: string;
  quantity: number;
  severity: 'minor' | 'major' | 'critical';
  location?: string;
  measurement?: number;
  tolerance?: string;
}

export interface InspectionSheet extends BaseEntity {
  sheetNumber: string;
  productCode: string;
  productName: string;
  poId: string;
  inspectionPoints: InspectionPoint[];
  inspectorId: string;
  inspectionDate: string;
  result: 'pass' | 'fail';
  notes?: string;
}

export interface InspectionPoint {
  id: string;
  parameter: string;
  specification: string;
  tolerance: string;
  actualValue: string;
  result: 'pass' | 'fail';
  method: string;
  equipment?: string;
}

// Warehouse Management Types
export interface MaterialTransaction extends BaseEntity {
  transactionNumber: string;
  type: 'inbound' | 'outbound';
  materialCode: string;
  materialName: string;
  quantity: number;
  unit: string;
  unitPrice?: number;
  totalValue?: number;
  supplierId?: string;
  supplierName?: string;
  poId?: string; // For outbound transactions
  lotNumber?: string;
  expiryDate?: string;
  storageLocation: string;
  warehouseStaffId: string;
  warehouseStaffName: string;
  transactionDate: string;
  notes?: string;
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: string;
}

export interface FinishedGoods extends BaseEntity {
  productCode: string;
  productName: string;
  poId: string;
  quantity: number;
  unit: string;
  lotNumber: string;
  productionDate: string;
  expiryDate?: string;
  qcStatus: 'pending' | 'passed' | 'failed';
  qcInspectionId?: string;
  storageLocation: string;
  status: 'in_stock' | 'reserved' | 'shipped';
  reservedQuantity?: number;
  notes?: string;
}

export interface DeliveryNote extends BaseEntity {
  deliveryNumber: string;
  customerName: string;
  customerAddress: string;
  deliveryDate: string;
  items: DeliveryItem[];
  totalValue: number;
  driverName?: string;
  vehicleNumber?: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'returned';
  deliveredAt?: string;
  receivedBy?: string;
  notes?: string;
}

export interface DeliveryItem {
  productCode: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  lotNumber: string;
}

// Shift Handover Types
export interface ShiftHandover extends BaseEntity {
  handoverNumber: string;
  type: 'leader' | 'worker';
  fromShift: 'morning' | 'afternoon' | 'night';
  toShift: 'morning' | 'afternoon' | 'night';
  handoverDate: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  productionSummary: ProductionSummary;
  issues: Issue[];
  pendingTasks: PendingTask[];
  machineStatus: MachineStatus[];
  notes?: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
}

export interface ProductionSummary {
  totalOutput: number;
  targetOutput: number;
  scrapQuantity: number;
  defectQuantity: number;
  downtimeMinutes: number;
  efficiency: number;
}

export interface Issue {
  id: string;
  type: 'quality' | 'machine' | 'material' | 'safety' | 'other';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved';
  assignedTo?: string;
  reportedAt: string;
  resolvedAt?: string;
}

export interface PendingTask {
  id: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  dueDate?: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface MachineStatus {
  machineId: string;
  machineName: string;
  status: 'running' | 'idle' | 'maintenance' | 'breakdown';
  currentJob?: string;
  toolOffsets?: ToolOffset[];
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  notes?: string;
}

export interface ToolOffset {
  toolNumber: string;
  xOffset: number;
  yOffset: number;
  zOffset: number;
  notes?: string;
}

export interface SetupSheet extends BaseEntity {
  setupNumber: string;
  poId: string;
  machineId: string;
  machineName: string;
  productCode: string;
  productName: string;
  setupDate: string;
  operatorId: string;
  operatorName: string;
  toolList: ToolItem[];
  cycleTime: number; // seconds
  setupTime: number; // minutes
  programNumber?: string;
  workOffset: WorkOffset;
  toolOffsets: ToolOffset[];
  qualityChecks: QualityCheck[];
  safetyNotes?: string;
  specialInstructions?: string;
  approvalStatus: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: string;
}

export interface ToolItem {
  toolNumber: string;
  toolType: string;
  toolDescription: string;
  diameter?: number;
  length?: number;
  material: string;
  coating?: string;
  supplier?: string;
  condition: 'new' | 'good' | 'worn' | 'damaged';
  notes?: string;
}

export interface WorkOffset {
  g54X: number;
  g54Y: number;
  g54Z: number;
  g55X?: number;
  g55Y?: number;
  g55Z?: number;
}

export interface QualityCheck {
  parameter: string;
  method: string;
  frequency: string;
  tolerance: string;
  equipment?: string;
}

// Statistics & Analytics Types
export interface ProductionStatistics {
  period: string;
  totalOrders: number;
  completedOrders: number;
  onTimeDelivery: number;
  totalOutput: number;
  scrapRate: number;
  defectRate: number;
  oeeAverage: number;
  machineUtilization: MachineUtilization[];
  topDefects: DefectStatistic[];
  productionTrend: TrendData[];
}

export interface MachineUtilization {
  machineId: string;
  machineName: string;
  utilizationRate: number;
  uptime: number;
  downtime: number;
  efficiency: number;
}

export interface DefectStatistic {
  defectType: string;
  count: number;
  percentage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface TrendData {
  date: string;
  value: number;
  target?: number;
}

export interface QCStatistics {
  period: string;
  totalInspections: number;
  passRate: number;
  failRate: number;
  incomingQuality: number;
  processQuality: number;
  finalQuality: number;
  defectsByType: DefectStatistic[];
  qualityTrend: TrendData[];
  costOfQuality: number;
}

export interface WarehouseStatistics {
  period: string;
  totalInbound: number;
  totalOutbound: number;
  currentStock: StockLevel[];
  stockTurnover: number;
  stockAccuracy: number;
  deliveryPerformance: DeliveryPerformance;
  inventoryValue: number;
  slowMovingItems: SlowMovingItem[];
}

export interface StockLevel {
  materialCode: string;
  materialName: string;
  currentQuantity: number;
  minimumLevel: number;
  maximumLevel: number;
  status: 'normal' | 'low' | 'out_of_stock' | 'overstock';
  daysOfSupply: number;
}

export interface DeliveryPerformance {
  onTimeDeliveries: number;
  totalDeliveries: number;
  onTimeRate: number;
  averageDeliveryTime: number;
}

export interface SlowMovingItem {
  materialCode: string;
  materialName: string;
  quantity: number;
  lastMovementDate: string;
  daysWithoutMovement: number;
  value: number;
}