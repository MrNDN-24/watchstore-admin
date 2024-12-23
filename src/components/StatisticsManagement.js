import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "jspdf-autotable"; // Nếu bạn muốn sử dụng autotable cho bảng báo cáo
import "../styles/StatisticsManagement.css";
import { getStatistics } from "../services/statisticServicesAdmin";

// Hàm định dạng số thành VND
const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(value);
};

const StatisticsManagement = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await getStatistics();
        setStatistics(data);
        setRevenueData(data.revenueData);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);
  const exportPDF = () => {
    if (!statistics) return;
  
    const doc = new jsPDF();
    
    // Lấy ảnh của phần tóm tắt và thêm vào PDF
    const summaryElement = document.querySelector(".statistics-summary");
    html2canvas(summaryElement).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 10, 10, 180, 50);
      
      // Lấy ảnh biểu đồ và thêm vào PDF
      const chartElement = document.getElementById("chart-container");
      html2canvas(chartElement).then((chartCanvas) => {
        const chartImgData = chartCanvas.toDataURL("image/png");
        doc.addImage(chartImgData, "PNG", 10, 70, 180, 100);
        doc.save("bao_cao_thong_ke.pdf");
      });
    });
  };
  
  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (!statistics) {
    return <div>Không thể tải dữ liệu thống kê.</div>;
  }

  return (
    <div className="statistics-container">
      <h2>Báo cáo và Thống kê</h2>

      <div className="statistics-summary">
        <div className="stat-item">
          <h3>Tổng Số Khách Hàng</h3>
          <p>{statistics.totalCustomers}</p>
        </div>
        <div className="stat-item">
          <h3>Tổng Số Sản Phẩm</h3>
          <p>{statistics.totalProducts}</p>
        </div>
        <div className="stat-item">
          <h3>Đơn Hàng Chưa Xác Nhận</h3>
          <p>{statistics.pendingOrders}</p>
        </div>
        <div className="stat-item">
          <h3>Đơn Hàng Giao Thành Công</h3>
          <p>{statistics.deliveredOrders}</p>
        </div>
        <div className="stat-item">
          <h3>Tổng Doanh Thu Tháng Hiện Tại</h3>
          <p>
            {statistics.monthTotal
              ? formatCurrency(statistics.monthTotal)
              : "N/A"}
          </p>
        </div>
      </div>
      <div className="export-section">
        <button className="buttonPDF" onClick={exportPDF}>
          Xuất PDF
        </button>
        <button
          className="buttonExcel"
          onClick={() => alert("Tính năng xuất Excel đang phát triển")}
        >
          Xuất Excel
        </button>
      </div>

      <div id="chart-container" className="chart-container">
        <h3>Biểu đồ Doanh Thu</h3>
        <ResponsiveContainer width="100%" height={600}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fontSize: 10 }} // Giảm kích thước font của nhãn
              scale="linear"
              padding={{ right: 10, top: 10, bottom: 10 }} // Thêm khoảng cách vào trục Y
            />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Line type="monotone" dataKey="doanhThu" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatisticsManagement;
