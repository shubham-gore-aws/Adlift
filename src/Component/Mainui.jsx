import React, { useState } from "react";
import { products } from "./Product";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const COLORS = ["#64B5F6", "#4DB6AC", "#FFB74D", "#E57373", "#9575CD"]; 

function Mainui() {
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [capacity, setCapacity] = useState("");
  const [productName, setProductName] = useState("");
  const [jsonData, setJsonData] = useState("");
  const [productList, setProductList] = useState(products);

  const handleAddProduct = () => {
    if (!productName || !jsonData) return;
    try {
      const parsed = JSON.parse(jsonData);
      const newProduct = {
        id: (productList.length + 1).toString(),
        name: productName,
        data: parsed,
      };
      setProductList([...productList, newProduct]);
      setProductName("");
      setJsonData("");
      setName("");
      setColor("");
      setCapacity("");
    } catch {
      alert("Invalid JSON");
    }
  };

  const normalizeColor = (data) => data?.color || data?.Color || "";
  const normalizeCapacity = (data) =>
    data?.capacity || data?.Capacity || (data?.["capacity GB"] ? `${data["capacity GB"]} GB` : "");

  const getFilteredProducts = () => {
    return productList.filter((product) => {
      const productColor = normalizeColor(product.data);
      const productCapacity = normalizeCapacity(product.data);
      return (
        (!name || product.name.toLowerCase().includes(name.toLowerCase())) &&
        (!color || productColor === color) &&
        (!capacity || productCapacity === capacity)
      );
    });
  };

  const filteredProducts = getFilteredProducts();

  const colorDistribution = {};
  const capacityDistribution = {};

  productList.forEach((product) => {
    const data = product.data;
    if (data) {
      const productColor = normalizeColor(data);
      const productCapacity = normalizeCapacity(data);
      if (productColor) colorDistribution[productColor] = (colorDistribution[productColor] || 0) + 1;
      if (productCapacity) capacityDistribution[productCapacity] = (capacityDistribution[productCapacity] || 0) + 1;
    }
  });

  const colorChartData = Object.entries(colorDistribution).map(([name, value]) => ({ name, value }));
  const capacityChartData = Object.entries(capacityDistribution).map(([name, value]) => ({ name, value }));

  const capacityColors = {
    "64 GB": "#AED581",
    "128 GB": "#64B5F6",
    "256 GB": "#FFD54F",
    "512 GB": "#F06292",
  };

  const capacityChartDataWithColors = capacityChartData.map((item, index) => ({
    ...item,
    color: capacityColors[item.name] || COLORS[index % COLORS.length],
  }));

  return (
    <div className="font-sans antialiased bg-gradient-to-br from-gray-200 to-gray-300 py-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-50 py-6 px-8 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-indigo-700 tracking-tight">Product Showcase</h1>
            <p className="text-sm text-gray-600 mt-1">Manage and visualize your product data.</p>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <input
              type="text"
              placeholder="Product Data (JSON)"
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              onClick={handleAddProduct}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Product
            </button>
          </div>
        </div>
        <div className="bg-indigo-100 py-3 px-8 border-b border-gray-200 flex space-x-4">
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Filter by Color</option>
            {Object.keys(colorDistribution).map((clr) => (
              <option key={clr} value={clr}>{clr}</option>
            ))}
          </select>
          <select
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Filter by Capacity</option>
            {Object.keys(capacityDistribution).map((cap) => (
              <option key={cap} value={cap}>{cap}</option>
            ))}
          </select>
        </div>

        {/* Product List */}
        <div className="p-8">
          {filteredProducts.length === 0 ? (
            <div className="text-gray-500 text-sm italic">No products match the current filters.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-md shadow-sm p-5 border border-gray-100 hover:shadow-md transition duration-200">
                  <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
                  {product.data ? (
                    <div className="text-gray-600 text-sm mt-2">
                      {normalizeColor(product.data) && <div><span className="font-medium">Color:</span> {normalizeColor(product.data)}</div>}
                      {normalizeCapacity(product.data) && <div><span className="font-medium">Capacity:</span> {normalizeCapacity(product.data)}</div>}
                      {!normalizeColor(product.data) && !normalizeCapacity(product.data) && <div className="text-gray-500">Data: N/A</div>}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm mt-2">Data: N/A</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-gray-50 border-t border-gray-200">
          <div className="bg-white rounded-md shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12h10M7 18h10M7 6h10" />
            </svg>Color Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={colorChartData} margin={{ top: 15, right: 30, left: 20, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" style={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} style={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#64B5F6" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-md shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l?6-6m-6 0l6 6m-3-9v18m-9-3h18M9 7h6m-6 3h6m-6 6h6" />
            </svg>Capacity Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart margin={{ top: 15, right: 30, left: 20, bottom: 15 }}>
                <Pie
                  data={capacityChartDataWithColors}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={40}
                  labelLine={false}
                  label={({ name, percent }) => percent > 0.02 ? `${name} ${(percent * 100).toFixed(0)}%` : null}
                  dataKey="value"
                  nameKey="name"
                >
                  {capacityChartDataWithColors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" iconSize={12} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mainui;