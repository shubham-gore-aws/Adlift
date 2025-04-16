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

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088FE"];

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
    // Always return all products unless filters are applied
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
    "64 GB": "#fdd835",
    "128 GB": "#00bcd4",
    "256 GB": "#ff9800",
    "512 GB": "#e91e63",
  };

  const capacityChartDataWithColors = capacityChartData.map((item, index) => ({
    ...item,
    color: capacityColors[item.name] || COLORS[index % COLORS.length],
  }));

  return (
    <div className="font-sans antialiased bg-gray-100 py-6">
      <div className="max-w-6xl mx-auto bg-white rounded-md shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 py-4 px-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-700">Product Listing with Charts</h1>
          <div className="mt-2 flex space-x-2">
            <input
              type="textarea"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="textarea"
              placeholder="Product Data (JSON)"
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleAddProduct}
              className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              Add Product
            </button>
          </div>
          <div className="mt-4 flex space-x-2">
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Filter by Color</option>
              {Object.keys(colorDistribution).map((clr) => (
                <option key={clr} value={clr}>{clr}</option>
              ))}
            </select>
            <select
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Filter by Capacity</option>
              {Object.keys(capacityDistribution).map((cap) => (
                <option key={cap} value={cap}>{cap}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Product List */}
        <div className="p-6">
          {filteredProducts.length === 0 ? (
            <div className="text-gray-500 text-sm italic">No products match the current filters.</div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-md mb-4 p-4">
                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                {product.data ? (
                  <div className="text-gray-600 text-sm mt-1">
                    {normalizeColor(product.data) && <div>Color: {normalizeColor(product.data)}</div>}
                    {normalizeCapacity(product.data) && <div>Capacity: {normalizeCapacity(product.data)}</div>}
                    {!normalizeColor(product.data) && !normalizeCapacity(product.data) && <div>Data: N/A</div>}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm mt-1">Data: N/A</div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 border-t border-gray-200">
          <div className="bg-white rounded-md shadow-sm p-4">
            <h2 className="text-md font-semibold text-gray-700 mb-2">Product Distribution by Color</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={colorChartData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" style={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} style={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-md shadow-sm p-4">
            <h2 className="text-md font-semibold text-gray-700 mb-2">Product Distribution by Capacity</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                <Pie
                  data={capacityChartDataWithColors}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  labelLine={false}
                  label={({ name, percent }) => percent > 0.01 ? `${name}` : null}
                  dataKey="value"
                  nameKey="name"
                >
                  {capacityChartDataWithColors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" align="bottom" wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mainui;
