import { useState, useRef, useEffect } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

interface NodeData {
  id: string;
  type: "machine" | "area";
  label: string;
}

interface FactoryLayoutProps {
  cols?: number;
  rowHeight?: number;
  width?: number;
}

interface GridCell {
  row: number;
  col: number;
  selected: boolean;
}

let nodeCounter = 1;

export default function FactoryLayout({
  cols: defaultCols = 12,
  rowHeight: defaultRowHeight = 50,
  width = 1000,
}: FactoryLayoutProps) {
  const [layout, setLayout] = useState<Layout[]>([]);
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [savedLayouts, setSavedLayouts] = useState<{ [key: string]: { layout: Layout[]; nodes: NodeData[] } }>({});

  // Grid settings
  const [cols, setCols] = useState(defaultCols);
  const [zoom, setZoom] = useState(1);

  // Tính toán cell width để ô luôn hình vuông
  const cellWidth = width / cols;
  const squareRowHeight = cellWidth; // Chiều cao = chiều rộng để hình vuông
  const rows = Math.floor(width / squareRowHeight); // Số hàng để container hình vuông

  // Selection state
  const [selectedCells, setSelectedCells] = useState<GridCell[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{ row: number, col: number } | null>(null);
  const [hasMoved, setHasMoved] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragStartCell, setDragStartCell] = useState<{ row: number; col: number } | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);

  // Tạo grid cells
  const generateGridCells = () => {
    const cells: GridCell[] = [];
    const totalRows = rows; // Dùng rows đã tính toán để hình vuông
    for (let row = 0; row < totalRows; row++) {
      for (let col = 0; col < cols; col++) {
        cells.push({ row, col, selected: false });
      }
    }
    return cells;
  };

  const [, setGridCells] = useState<GridCell[]>(generateGridCells());

  // Cập nhật grid khi thay đổi cols
  useEffect(() => {
    setGridCells(generateGridCells());
    setSelectedCells([]);
  }, [cols, rows]);

  // Tính ô từ tọa độ chuột trên container
  const getCellFromMouseEvent = (event: React.MouseEvent): { row: number; col: number } | null => {
    const container = gridRef.current;
    if (!container) return null;
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (x < 0 || y < 0 || x >= width || y >= width) return null;
    const col = Math.max(0, Math.min(cols - 1, Math.floor(x / squareRowHeight)));
    const row = Math.max(0, Math.min(rows - 1, Math.floor(y / squareRowHeight)));
    return { row, col };
  };

  // Mouse handlers ở container
  const onGridMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const cell = getCellFromMouseEvent(event);
    if (!cell) return;
    setIsMouseDown(true);
    setIsSelecting(false);
    setHasMoved(false);
    setDragStartCell(cell);
    setSelectionStart(cell);
  };

  const onGridMouseMove = (event: React.MouseEvent) => {
    if (!isMouseDown || !dragStartCell) return;
    const cell = getCellFromMouseEvent(event);
    if (!cell) return;
    if (cell.row === dragStartCell.row && cell.col === dragStartCell.col) return;
    // Bắt đầu drag khi di chuyển sang ô khác
    setHasMoved(true);
    setIsSelecting(true);
    const minRow = Math.min(dragStartCell.row, cell.row);
    const maxRow = Math.max(dragStartCell.row, cell.row);
    const minCol = Math.min(dragStartCell.col, cell.col);
    const maxCol = Math.max(dragStartCell.col, cell.col);
    const newSelection: GridCell[] = [];
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        newSelection.push({ row: r, col: c, selected: true });
      }
    }
    setSelectedCells(newSelection);
  };

  const onGridMouseUp = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (isMouseDown) {
      if (!isSelecting && dragStartCell) {
        // Click đơn thuần: chỉ toggle 1 ô
        setSelectedCells(prev => {
          const exists = prev.some(cell => cell.row === dragStartCell.row && cell.col === dragStartCell.col);
          if (exists) {
            return prev.filter(cell => !(cell.row === dragStartCell.row && cell.col === dragStartCell.col));
          }
          return [{ row: dragStartCell.row, col: dragStartCell.col, selected: true }];
        });
      }
    }
    setIsMouseDown(false);
    setIsSelecting(false);
    setHasMoved(false);
    setDragStartCell(null);
    setSelectionStart(null);
  };

  // Thêm máy vào vị trí đã chọn
  const addMachineToSelection = () => {
    if (selectedCells.length === 0) {
      alert("Vui lòng chọn ít nhất 1 ô!");
      return;
    }

    const id = "node-" + nodeCounter++;
    const minRow = Math.min(...selectedCells.map(c => c.row));
    const minCol = Math.min(...selectedCells.map(c => c.col));
    const maxRow = Math.max(...selectedCells.map(c => c.row));
    const maxCol = Math.max(...selectedCells.map(c => c.col));

    const widthCells = maxCol - minCol + 1;
    const heightCells = maxRow - minRow + 1;

    const newItem: Layout = {
      i: id,
      x: minCol,
      y: minRow,
      w: widthCells,
      h: heightCells,
      static: false // Cho phép di chuyển
    };

    setLayout([...layout, newItem]);
    setNodes([...nodes, { id, type: "machine", label: "Máy " + id }]);
    setSelectedCells([]);
  };

  // Thêm khu vực vào vị trí đã chọn
  const addAreaToSelection = () => {
    if (selectedCells.length === 0) {
      alert("Vui lòng chọn ít nhất 1 ô!");
      return;
    }

    const id = "node-" + nodeCounter++;
    const minRow = Math.min(...selectedCells.map(c => c.row));
    const minCol = Math.min(...selectedCells.map(c => c.col));
    const maxRow = Math.max(...selectedCells.map(c => c.row));
    const maxCol = Math.max(...selectedCells.map(c => c.col));

    const widthCells = maxCol - minCol + 1;
    const heightCells = maxRow - minRow + 1;

    const newItem: Layout = {
      i: id,
      x: minCol,
      y: minRow,
      w: widthCells,
      h: heightCells,
      static: false // Cho phép di chuyển
    };

    setLayout([...layout, newItem]);
    setNodes([...nodes, { id, type: "area", label: "Khu vực " + id }]);
    setSelectedCells([]);
  };

  // Đổi tên khu vực/máy
  const updateLabel = (id: string, newLabel: string) => {
    setNodes(nodes.map(n => (n.id === id ? { ...n, label: newLabel } : n)));
  };

  // Xóa tất cả selection
  const clearSelection = () => {
    setSelectedCells([]);
  };

  // Lưu layout
  const saveLayout = () => {
    const version = "layout-" + new Date().getTime();
    setSavedLayouts({
      ...savedLayouts,
      [version]: { layout, nodes },
    });
    alert("Đã lưu layout: " + version);
  };

  // Tạo mới
  const newLayout = () => {
    setLayout([]);
    setNodes([]);
    setSelectedCells([]);
  };

  // Load layout
  const loadLayout = (version: string) => {
    const saved = savedLayouts[version];
    if (saved) {
      setLayout(saved.layout);
      setNodes(saved.nodes);
    }
  };

  // Kiểm tra ô có được chọn không
  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
  };

  // Kiểm tra ô có bị chiếm bởi layout không
  const isCellOccupied = (row: number, col: number) => {
    return layout.some(item =>
      row >= item.y && row < item.y + item.h &&
      col >= item.x && col < item.x + item.w
    );
  };

  return (
    <div>
      <div className="mb-4">
        <div className="mb-4 flex items-center gap-4">
          <label className="flex items-center gap-2">
            Cols:
            <input
              type="number"
              value={cols}
              onChange={(e) => setCols(Number(e.target.value))}
              min="1"
              max="20"
              className="w-16 px-2 py-1 border border-gray-300 rounded"
            />
          </label>

          <label className="flex items-center gap-2">
            Zoom:
            <input
              type="range"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              min="0.5"
              max="2"
              step="0.1"
              className="w-24"
            />
            <span className="text-sm">{Math.round(zoom * 100)}%</span>
          </label>
          <span className="text-sm text-gray-600">
            Grid: {cols} x {rows} ô (Hình vuông {Math.round(squareRowHeight)}px)
          </span>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={addMachineToSelection}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            ➕ Thêm máy
          </button>
          <button
            onClick={addAreaToSelection}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            🏭 Thêm khu vực
          </button>
          <button
            onClick={clearSelection}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            🗑️ Xóa chọn
          </button>
          <button
            onClick={saveLayout}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            💾 Lưu layout
          </button>
          <button
            onClick={newLayout}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            🆕 Tạo mới
          </button>

          {Object.keys(savedLayouts).length > 0 && (
            <select
              onChange={(e) => loadLayout(e.target.value)}
              defaultValue=""
              className="px-4 py-2 border border-gray-300 rounded"
            >
              <option value="" disabled>🔄 Load layout</option>
              {Object.keys(savedLayouts).map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {selectedCells.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-300 rounded-lg">
          <strong className="text-blue-800">Đã chọn {selectedCells.length} ô</strong>
          <span className="text-blue-600 ml-2">
            (Từ {Math.min(...selectedCells.map(c => c.row))},{Math.min(...selectedCells.map(c => c.col))}
            đến {Math.max(...selectedCells.map(c => c.row))},{Math.max(...selectedCells.map(c => c.col))})
          </span>
        </div>
      )}

      <div className="relative" style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}>
        {/* Background Grid */}
        <div
          ref={gridRef}
          className="w-[1000px] h-[1000px] border-2 border-gray-800 bg-white relative overflow-hidden"
          onMouseDown={onGridMouseDown}
          onMouseMove={onGridMouseMove}
          onMouseUp={onGridMouseUp}
          onMouseLeave={onGridMouseUp}
          style={{ zIndex: 1 }}
        >
          {Array.from({ length: rows }, (_, row) =>
            Array.from({ length: cols }, (_, col) => (
              <div
                key={`${row}-${col}`}
                style={{
                  position: "absolute",
                  left: col * squareRowHeight,
                  top: row * squareRowHeight,
                  width: squareRowHeight,
                  height: squareRowHeight,
                  border: "1px solid #ddd",
                  backgroundColor: isCellSelected(row, col)
                    ? "#ffeb3b"
                    : isCellOccupied(row, col)
                      ? "#e0e0e0"
                      : "#f9f9f9",
                  cursor: "pointer",
                  boxSizing: "border-box",
                  userSelect: "none" as const,
                  margin: 0,
                  padding: 0,
                }}
              />
            ))
          )}
        </div>

        {/* Layout Items */}
        <div className="absolute top-0 left-0" style={{ zIndex: 2 }}>
          <GridLayout
            className="layout"
            layout={layout}
            cols={cols}
            rowHeight={squareRowHeight}
            width={width}
            onLayoutChange={(newLayout: Layout[]) => setLayout(newLayout)}
            isDraggable={true}
            isResizable={true}
            compactType={null} // Ngăn tự động đẩy lên
            preventCollision={true} // Ngăn va chạm
            margin={[0, 0]} // Không có margin
            containerPadding={[0, 0]} // Không có padding
          >
            {nodes.map((node) => (
              <div
                key={node.id}
                className={`flex flex-col items-center justify-center ${
                  node.type === "machine" ? "bg-blue-500 text-white" : "bg-green-500 text-white"
                }`}
                style={{
                  border: "1px solid #333",
                  boxSizing: "border-box",
                  margin: 0,
                  padding: "2px"
                }}
              >
                <strong className="text-sm font-bold">{node.label}</strong>
                <input
                  className="mt-1 text-xs w-[90%] px-1 py-0.5 border border-gray-400 rounded text-black"
                  value={node.label}
                  onChange={(e) => updateLabel(node.id, e.target.value)}
                />
              </div>
            ))}
          </GridLayout>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <strong>Hướng dẫn:</strong> Click để chọn từng ô, kéo chuột (drag) để chọn vùng nhiều ô. Sau đó nhấn "Thêm máy" hoặc "Thêm khu vực" để đặt vào vị trí đã chọn.
      </div>
    </div>
  );
}
