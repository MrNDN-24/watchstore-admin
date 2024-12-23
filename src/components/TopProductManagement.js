import React, { useEffect, useState } from "react";
import "../styles/TopProductManagement.css";
import { Bar } from "react-chartjs-2";
import { getTopProducts } from "../services/statisticServicesAdmin";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { jsPDF } from "jspdf";
import "jspdf-autotable";


import html2canvas from "html2canvas";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TopProductManagement = () => {
  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const { chartData, tableData } = await getTopProducts();
        setChartData(chartData);
        setTableData(tableData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
      }
    };
    fetchTopProducts();
  }, []);

  const data = {
    labels: chartData.map((item) => `Mã SP: ${item.productCode}`),
    datasets: [
      {
        label: "Số lượng bán ra",
        data: chartData.map((item) => item.sold),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Hàm xuất PDF
  const exportToPDF = () => {
    const input = document.getElementById("pdf-content");
    const table = document.querySelector(".top-product-table-container");

    // Tạo một tài liệu PDF mới
    const doc = new jsPDF();

    // Xuất biểu đồ
    html2canvas(input).then((canvas) => {
      const chartImage = canvas.toDataURL("image/png");
      doc.addImage(chartImage, "PNG", 10, 10, 180, 100);

      // Xuất bảng dữ liệu
      html2canvas(table).then((canvasTable) => {
        const tableImage = canvasTable.toDataURL("image/png");
        doc.addPage();
        doc.addImage(tableImage, "PNG", 10, 10, 180, 100);

        // Lưu file PDF
        doc.save("Top-Products-Report.pdf");
      });
    });
  };

  return (
    <div className="top-product-container">
      <h1 className="top-product-title">Top Sản Phẩm Bán Chạy</h1>
      <button className="buttonPDF-product" onClick={exportToPDF}>
        Xuất PDF
      </button>

      <div className="top-product-chart-container" id="pdf-content">
        <Bar
          data={data}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
            },
          }}
        />
      </div>

      <div className="top-product-table-container" id="pdf-table">
        <h2 className="top-product-table-title">Chi Tiết Sản Phẩm</h2>
        <table className="top-product-table">
          <thead>
            <tr>
              <th>Mã Sản Phẩm</th>
              <th>Tên Sản Phẩm</th>
              <th>Số Lượng Bán</th>
              <th>Doanh Thu</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr key={index}>
                <td>{item.productCode}</td>
                <td>{item.name}</td>
                <td>{item.sold}</td>
                <td>{formatCurrency(item.totalRevenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopProductManagement;
