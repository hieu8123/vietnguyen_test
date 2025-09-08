import { useState, useEffect } from 'react';
import type { Customer, Product, Material, Supplier, Machine } from '../types';

// Mock data - trong thực tế sẽ gọi API
const mockCustomers: Customer[] = [
  {
    id: '1',
    customerCode: 'CUST-001',
    customerName: 'Samsung Electronics',
    contactPerson: 'Kim Min Jun',
    phone: '+84-28-1234-5678',
    email: 'kim.minjun@samsung.com',
    address: '123 Nguyen Hue Street, District 1, Ho Chi Minh City',
    taxCode: '0123456789',
    paymentTerms: 'NET 30',
    creditLimit: 1000000000,
    status: 'active',
    notes: 'Khách hàng VIP, ưu tiên xử lý',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
    createdBy: 'admin'
  },
  {
    id: '2',
    customerCode: 'CUST-002',
    customerName: 'LG Display',
    contactPerson: 'Park Seo Jun',
    phone: '+84-28-8765-4321',
    email: 'park.seojun@lgdisplay.com',
    address: '456 Le Loi Street, District 3, Ho Chi Minh City',
    taxCode: '0987654321',
    paymentTerms: 'NET 45',
    creditLimit: 800000000,
    status: 'active',
    notes: 'Yêu cầu báo cáo chất lượng chi tiết',
    createdAt: '2024-01-02T09:00:00Z',
    updatedAt: '2024-01-02T09:00:00Z',
    createdBy: 'admin'
  },
  {
    id: '3',
    customerCode: 'CUST-003',
    customerName: 'Intel Vietnam',
    contactPerson: 'John Smith',
    phone: '+84-28-5555-1234',
    email: 'john.smith@intel.com',
    address: '789 Dong Khoi Street, District 1, Ho Chi Minh City',
    taxCode: '0555123456',
    paymentTerms: 'NET 60',
    creditLimit: 1500000000,
    status: 'active',
    notes: 'Đối tác chiến lược, giao hàng ưu tiên',
    createdAt: '2024-01-03T10:00:00Z',
    updatedAt: '2024-01-03T10:00:00Z',
    createdBy: 'admin'
  }
];

const mockProducts: Product[] = [
  {
    id: '1',
    productCode: 'PCB-A1-001',
    productName: 'PCB Board A1',
    category: 'Electronics',
    specification: 'FR4, 1.6mm, Green Solder Mask',
    unit: 'pcs',
    standardCost: 45000,
    sellingPrice: 75000,
    leadTime: 7,
    minOrderQuantity: 100,
    status: 'active',
    bomId: 'BOM-001',
    notes: 'Sản phẩm chính cho Samsung',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
    createdBy: 'admin'
  },
  {
    id: '2',
    productCode: 'CON-B-002',
    productName: 'Connector Type B',
    category: 'Connectors',
    specification: '50-pin, Gold Plated',
    unit: 'pcs',
    standardCost: 25000,
    sellingPrice: 40000,
    leadTime: 5,
    minOrderQuantity: 500,
    status: 'active',
    bomId: 'BOM-002',
    notes: 'Connector chuyên dụng cho LG Display',
    createdAt: '2024-01-02T09:00:00Z',
    updatedAt: '2024-01-02T09:00:00Z',
    createdBy: 'admin'
  },
  {
    id: '3',
    productCode: 'HS-C-003',
    productName: 'Heat Sink Model C',
    category: 'Thermal Management',
    specification: 'Aluminum 6061, Anodized',
    unit: 'pcs',
    standardCost: 85000,
    sellingPrice: 125000,
    leadTime: 10,
    minOrderQuantity: 50,
    status: 'active',
    bomId: 'BOM-003',
    notes: 'Tản nhiệt cho Intel processors',
    createdAt: '2024-01-03T10:00:00Z',
    updatedAt: '2024-01-03T10:00:00Z',
    createdBy: 'admin'
  }
];

const mockMaterials: Material[] = [
  {
    id: '1',
    materialCode: 'AL-6061-100',
    materialName: 'Aluminum 6061 Sheet',
    category: 'Metal',
    specification: '100x50x10mm, T6 Temper',
    unit: 'pcs',
    standardCost: 50000,
    supplier: 'ABC Materials Co.',
    supplierId: 'SUP-001',
    minimumStock: 100,
    maximumStock: 500,
    leadTime: 14,
    storageLocation: 'A-01-01',
    status: 'active',
    notes: 'Chất lượng cao, dùng cho PCB mounting',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
    createdBy: 'admin'
  },
  {
    id: '2',
    materialCode: 'SS-304-200',
    materialName: 'Stainless Steel 304',
    category: 'Metal',
    specification: '200x100x5mm, Mirror Finish',
    unit: 'pcs',
    standardCost: 75000,
    supplier: 'DEF Steel Ltd.',
    supplierId: 'SUP-002',
    minimumStock: 50,
    maximumStock: 200,
    leadTime: 21,
    storageLocation: 'B-02-01',
    status: 'active',
    notes: 'Inox 304 cao cấp, chống ăn mòn tốt',
    createdAt: '2024-01-02T09:00:00Z',
    updatedAt: '2024-01-02T09:00:00Z',
    createdBy: 'admin'
  },
  {
    id: '3',
    materialCode: 'CU-101-50',
    materialName: 'Copper C101',
    category: 'Metal',
    specification: 'Pure Copper, 99.9%',
    unit: 'kg',
    standardCost: 120000,
    supplier: 'GHI Metals Inc.',
    supplierId: 'SUP-003',
    minimumStock: 20,
    maximumStock: 100,
    leadTime: 10,
    storageLocation: 'C-01-02',
    status: 'active',
    notes: 'Đồng nguyên chất cho ứng dụng điện tử',
    createdAt: '2024-01-03T10:00:00Z',
    updatedAt: '2024-01-03T10:00:00Z',
    createdBy: 'admin'
  }
];

const mockSuppliers: Supplier[] = [
  {
    id: '1',
    supplierCode: 'SUP-001',
    supplierName: 'ABC Materials Co.',
    contactPerson: 'Nguyễn Văn A',
    phone: '+84-28-1111-2222',
    email: 'contact@abcmaterials.com',
    address: '123 Công nghiệp Street, Bình Dương',
    taxCode: '0301234567',
    paymentTerms: 'NET 30',
    deliveryTerms: 'FOB Factory',
    qualityRating: 5,
    status: 'active',
    notes: 'Nhà cung cấp uy tín, chất lượng tốt',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
    createdBy: 'admin'
  },
  {
    id: '2',
    supplierCode: 'SUP-002',
    supplierName: 'DEF Steel Ltd.',
    contactPerson: 'Trần Thị B',
    phone: '+84-28-3333-4444',
    email: 'sales@defsteel.com',
    address: '456 Industrial Zone, Đồng Nai',
    taxCode: '0302345678',
    paymentTerms: 'NET 45',
    deliveryTerms: 'CIF Port',
    qualityRating: 4,
    status: 'active',
    notes: 'Chuyên cung cấp thép inox, giao hàng đúng hạn',
    createdAt: '2024-01-02T09:00:00Z',
    updatedAt: '2024-01-02T09:00:00Z',
    createdBy: 'admin'
  },
  {
    id: '3',
    supplierCode: 'SUP-003',
    supplierName: 'GHI Metals Inc.',
    contactPerson: 'Lê Văn C',
    phone: '+84-28-5555-6666',
    email: 'info@ghimetals.com',
    address: '789 Export Processing Zone, Hồ Chí Minh',
    taxCode: '0303456789',
    paymentTerms: 'NET 60',
    deliveryTerms: 'EXW Warehouse',
    qualityRating: 4,
    status: 'active',
    notes: 'Chuyên kim loại màu, giá cạnh tranh',
    createdAt: '2024-01-03T10:00:00Z',
    updatedAt: '2024-01-03T10:00:00Z',
    createdBy: 'admin'
  }
];

const mockMachines: Machine[] = [
  {
    id: '1',
    machineCode: 'MC-001',
    machineName: 'CNC Milling Machine A1',
    type: 'CNC Milling',
    manufacturer: 'Haas Automation',
    model: 'VF-2SS',
    serialNumber: 'HS2024001',
    installationDate: '2023-06-15',
    capacity: 500,
    status: 'active',
    location: 'Production Line 1',
    maintenanceSchedule: 'Weekly',
    lastMaintenanceDate: '2024-01-08',
    nextMaintenanceDate: '2024-01-15',
    notes: 'Máy CNC chính cho gia công PCB',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
    createdBy: 'admin'
  },
  {
    id: '2',
    machineCode: 'MC-002',
    machineName: 'Injection Molding Press B2',
    type: 'Injection Molding',
    manufacturer: 'Sumitomo',
    model: 'SE180DU',
    serialNumber: 'SM2023005',
    installationDate: '2023-08-20',
    capacity: 180,
    status: 'maintenance',
    location: 'Production Line 2',
    maintenanceSchedule: 'Monthly',
    lastMaintenanceDate: '2024-01-10',
    nextMaintenanceDate: '2024-02-10',
    notes: 'Đang bảo trì định kỳ',
    createdAt: '2024-01-02T09:00:00Z',
    updatedAt: '2024-01-10T14:00:00Z',
    createdBy: 'admin'
  },
  {
    id: '3',
    machineCode: 'MC-003',
    machineName: 'Laser Cutting System C3',
    type: 'Laser Cutting',
    manufacturer: 'Trumpf',
    model: 'TruLaser 3030',
    serialNumber: 'TR2024002',
    installationDate: '2023-09-10',
    capacity: 300,
    status: 'active',
    location: 'Cutting Department',
    maintenanceSchedule: 'Bi-weekly',
    lastMaintenanceDate: '2024-01-05',
    nextMaintenanceDate: '2024-01-19',
    notes: 'Máy cắt laser độ chính xác cao',
    createdAt: '2024-01-03T10:00:00Z',
    updatedAt: '2024-01-05T16:00:00Z',
    createdBy: 'admin'
  }
];

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setCustomers(mockCustomers.filter(c => c.status === 'active'));
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return { customers, loading };
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setProducts(mockProducts.filter(p => p.status === 'active'));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading };
};

export const useMaterials = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setMaterials(mockMaterials.filter(m => m.status === 'active'));
      } catch (error) {
        console.error('Error fetching materials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  return { materials, loading };
};

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setSuppliers(mockSuppliers.filter(s => s.status === 'active'));
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  return { suppliers, loading };
};

export const useMachines = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMachines = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setMachines(mockMachines.filter(m => m.status === 'active'));
      } catch (error) {
        console.error('Error fetching machines:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMachines();
  }, []);

  return { machines, loading };
};
