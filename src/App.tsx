import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import MainLayout from './layout/MainLayout';
import Dashboard from './pages/Dashboard';

// Production Management
import MachineReport from './pages/production/MachineReport';
import ProductionOrder from './pages/production/ProductionOrder';
import CustomerBOM from './pages/production/CustomerBOM';
import ProductionOutput from './pages/production/ProductionOutput';
import ProcessControl from './pages/production/ProcessControl';
import ProcessEvaluation from './pages/production/ProcessEvaluation';

// Quality Control
import MaterialIncoming from './pages/quality/MaterialIncoming';
import InspectionSheet from './pages/quality/InspectionSheet';
import FinalInspection from './pages/quality/FinalInspection';
import QCInspection from './pages/quality/QCInspection';
import ProgramCheck from './pages/quality/ProgramCheck';
import ProgramUpdate from './pages/quality/ProgramUpdate';

// Warehouse Management
import OutsourcingExport from './pages/warehouse/OutsourcingExport';
import MaterialExport from './pages/warehouse/MaterialExport';
import DeliveryNote from './pages/warehouse/DeliveryNote';
import DailyDeliveryTracking from './pages/warehouse/DailyDeliveryTracking';
import FinishedGoodsInventory from './pages/warehouse/FinishedGoodsInventory';
import MaterialInOut from './pages/warehouse/MaterialInOut';
import SuppliesInOut from './pages/warehouse/SuppliesInOut';
import MaterialImport from './pages/warehouse/MaterialImport';
import SuppliesImport from './pages/warehouse/SuppliesImport';

// Shift Handover & Setup
import LeaderHandover from './pages/shift/LeaderHandover';
import WorkerHandover from './pages/shift/WorkerHandover';
import SetupSheet from './pages/shift/SetupSheet';

// Statistics
import ProductionStatistics from './pages/statistics/ProductionStatistics';
import QCAnalytics from './pages/statistics/QCAnalytics';
import WarehouseAnalytics from './pages/statistics/WarehouseAnalytics';

// Master Data
import { 
  CustomerMaster, 
  ProductMaster, 
  MaterialMaster, 
  SupplierMaster, 
  MachineMaster 
} from './pages/master';

import './App.css';

function App() {
  return (
    <ConfigProvider locale={viVN}>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Production Management Routes */}
            <Route path="production">
              <Route path="machine-report" element={<MachineReport />} />
              <Route path="production-order" element={<ProductionOrder />} />
              <Route path="customer-bom" element={<CustomerBOM />} />
              <Route path="production-output" element={<ProductionOutput />} />
              <Route path="process-control" element={<ProcessControl />} />
              <Route path="process-evaluation" element={<ProcessEvaluation />} />
            </Route>
            
            {/* Quality Control Routes */}
            <Route path="quality">
              <Route path="material-incoming" element={<MaterialIncoming />} />
              <Route path="inspection-sheet" element={<InspectionSheet />} />
              <Route path="final-inspection" element={<FinalInspection />} />
              <Route path="qc-inspection" element={<QCInspection />} />
              <Route path="program-check" element={<ProgramCheck />} />
              <Route path="program-update" element={<ProgramUpdate />} />
            </Route>
            
            {/* Warehouse Management Routes */}
            <Route path="warehouse">
              <Route path="outsourcing-export" element={<OutsourcingExport />} />
              <Route path="material-export" element={<MaterialExport />} />
              <Route path="delivery-note" element={<DeliveryNote />} />
              <Route path="daily-delivery" element={<DailyDeliveryTracking />} />
              <Route path="finished-goods" element={<FinishedGoodsInventory />} />
              <Route path="material-in-out" element={<MaterialInOut />} />
              <Route path="supplies-in-out" element={<SuppliesInOut />} />
              <Route path="material-import" element={<MaterialImport />} />
              <Route path="supplies-import" element={<SuppliesImport />} />
            </Route>
            
            {/* Shift Handover Routes */}
            <Route path="shift">
              <Route path="leader-handover" element={<LeaderHandover />} />
              <Route path="worker-handover" element={<WorkerHandover />} />
              <Route path="setup-sheet" element={<SetupSheet />} />
            </Route>
            
            {/* Master Data Routes */}
            <Route path="master">
              <Route path="customer" element={<CustomerMaster />} />
              <Route path="product" element={<ProductMaster />} />
              <Route path="material" element={<MaterialMaster />} />
              <Route path="supplier" element={<SupplierMaster />} />
              <Route path="machine" element={<MachineMaster />} />
            </Route>
            
            {/* Statistics Routes */}
            <Route path="statistics">
              <Route path="production" element={<ProductionStatistics />} />
              <Route path="quality" element={<QCAnalytics />} />
              <Route path="warehouse" element={<WarehouseAnalytics />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;