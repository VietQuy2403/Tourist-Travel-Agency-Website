import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 1rem 2rem 1rem;
  min-height: 100vh;
  background-color: #f9f9f9;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const SearchSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const EmailInput = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
  font-size: 1rem;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  text-align: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #f8d7da;
  border-radius: 4px;
`;

const Loading = styled.div`
  text-align: center;
  color: #666;
  margin: 2rem 0;
`;

const BookingsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BookingCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const BookingInfo = styled.div`
  h3 {
    color: #333;
    margin-bottom: 1rem;
  }

  p {
    color: #666;
    margin-bottom: 0.5rem;
  }
`;

const Status = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-left: 0.5rem;
  background-color: ${props => 
    props.status === "confirmed" ? "#d4edda" :
    props.status === "cancelled" ? "#f8d7da" : "#cce5ff"};
  color: ${props => 
    props.status === "confirmed" ? "#155724" :
    props.status === "cancelled" ? "#721c24" : "#004085"};
`;

const CancelButton = styled.button`
  margin-top: 1rem;
  padding: 0.8rem 1rem;
  width: 100%;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: 500;

  &:hover {
    background-color: #c82333;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

  h3 {
    margin-bottom: 1rem;
    color: #333;
    font-size: 1.5rem;
  }

  p {
    margin-bottom: 1rem;
    color: #555;
  }
`;

const CancelReasonInput = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.8rem;
  margin: 1rem 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const ConfirmButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: 500;

  &:hover {
    background-color: #c82333;
  }
`;

const NoBookingsMessage = styled.div`
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  margin-top: 2rem;
  color: #666;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.active ? "#007bff" : "white"};
  color: ${props => props.active ? "white" : "#333"};
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: ${props => props.active ? "#0056b3" : "#f1f1f1"};
  }
`;

const formatDate = (dateString) => {
  if (!dateString) return 'Chưa có ngày';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Lỗi format ngày:', error);
    return 'Ngày không hợp lệ';
  }
};

const ManageBooking = () => {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Tự động kiểm tra trạng thái đăng nhập và tải dữ liệu
  useEffect(() => {
    console.log("Component đang tải...");
    // Kiểm tra trạng thái đăng nhập
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("token");
      const storedEmail = localStorage.getItem("email");
      
      console.log("Kiểm tra email:", storedEmail);
      
      if (token && storedEmail) {
        console.log("Người dùng đã đăng nhập với email:", storedEmail);
        setIsLoggedIn(true);
        setUserEmail(storedEmail);
        setEmail(storedEmail);
        await fetchBookings(storedEmail);
      } else {
        console.log("Người dùng chưa đăng nhập");
        setLoading(false);
      }
    };
    
    checkLoginStatus();
  }, []);

  // Tải danh sách đặt tour
  const fetchBookings = async (emailToSearch) => {
    console.log("Đang tải danh sách booking cho email:", emailToSearch);
    try {
      setLoading(true);
      setError("");
      
      const response = await axios.get("http://localhost:5000/api/bookings");
      console.log("Dữ liệu API trả về:", response.data);
      
      if (emailToSearch) {
        const userBookings = response.data.filter(booking => 
          booking.email.toLowerCase() === emailToSearch.toLowerCase()
        );
        console.log(`Đã tìm thấy ${userBookings.length} booking cho email: ${emailToSearch}`);
        setBookings(userBookings);
        setFilteredBookings(userBookings);
      } else {
        setBookings(response.data);
        setFilteredBookings(response.data);
      }
    } catch (err) {
      console.error("Lỗi khi tải bookings:", err);
      setError("Không thể tải danh sách đặt vé. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Tìm kiếm đặt tour theo email
  const searchBookings = async () => {
    if (!email) {
      setError("Vui lòng nhập email để tìm kiếm");
      return;
    }
    fetchBookings(email);
  };

  // Lọc theo trạng thái
  const filterBookings = (status) => {
    setActiveFilter(status);
    if (status === "all") {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter(booking => booking.status === status));
    }
  };

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!cancelReason) {
      alert("Vui lòng nhập lý do hủy vé");
      return;
    }
    
    try {
      await axios.post(`http://localhost:5000/api/bookings/${selectedBooking._id}/cancel`, {
        cancelReason
      });
      
      const updatedBookings = bookings.map(booking => 
        booking._id === selectedBooking._id 
          ? { ...booking, status: "cancelled", cancelReason, cancelledAt: new Date() }
          : booking
      );
      
      setBookings(updatedBookings);
      filterBookings(activeFilter);
      
      setShowCancelModal(false);
      setCancelReason("");
      setSelectedBooking(null);
    } catch (err) {
      setError("Không thể hủy vé. Vui lòng thử lại.");
      console.error("Error cancelling booking:", err);
    }
  };

  return (
    <Container>
      <Title>Quản lý đặt tour</Title>
      
      {isLoggedIn ? (
        <SearchSection>
          <p>Xin chào, {userEmail}! Đây là danh sách các tour bạn đã đặt.</p>
        </SearchSection>
      ) : (
        <SearchSection>
          <EmailInput
            type="email"
            placeholder="Nhập email đã đặt vé"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <SearchButton onClick={searchBookings}>
            Tìm kiếm
          </SearchButton>
        </SearchSection>
      )}

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {bookings.length > 0 && (
        <FilterContainer>
          <FilterButton 
            active={activeFilter === "all"} 
            onClick={() => filterBookings("all")}
          >
            Tất cả
          </FilterButton>
          <FilterButton 
            active={activeFilter === "confirmed"} 
            onClick={() => filterBookings("confirmed")}
          >
            Đã xác nhận
          </FilterButton>
          <FilterButton 
            active={activeFilter === "cancelled"} 
            onClick={() => filterBookings("cancelled")}
          >
            Đã hủy
          </FilterButton>
        </FilterContainer>
      )}

      {loading ? (
        <Loading>Đang tải...</Loading>
      ) : filteredBookings.length > 0 ? (
        <BookingsList>
          {filteredBookings.map(booking => (
            <BookingCard key={booking._id}>
              <BookingInfo>
                <h3>Chuyến bay: {booking.departureCity} - {booking.arrivalCity}</h3>
                <p><strong>Khách hàng:</strong> {booking.name}</p>
                <p><strong>Email:</strong> {booking.email}</p>
                <p><strong>Ngày khởi hành:</strong> {formatDate(booking.departureDate)}</p>
                <p><strong>Hạng vé:</strong> {booking.flightClass}</p>
                <p><strong>Số hành khách:</strong> {booking.passengers} người</p>
                <p><strong>Tổng tiền:</strong> {new Intl.NumberFormat('vi-VN', { 
                  style: 'currency', 
                  currency: 'VND' 
                }).format(booking.totalPrice || booking.amount || 0)}</p>
                <p><strong>Trạng thái:</strong> 
                  <Status status={booking.status}>
                    {booking.status === "confirmed" ? "Đã xác nhận" : 
                     booking.status === "cancelled" ? "Đã hủy" : "Chờ xác nhận"}
                  </Status>
                </p>
                {booking.cancelReason && (
                  <p><strong>Lý do hủy:</strong> {booking.cancelReason}</p>
                )}
                {booking.cancelledAt && (
                  <p><strong>Ngày hủy:</strong> {formatDate(booking.cancelledAt)}</p>
                )}
              </BookingInfo>
              {booking.status !== "cancelled" && (
                <CancelButton onClick={() => handleCancelClick(booking)}>
                  Hủy chuyến bay
                </CancelButton>
              )}
            </BookingCard>
          ))}
        </BookingsList>
      ) : (
        <NoBookingsMessage>
          {isLoggedIn 
            ? "Bạn chưa có đặt tour nào. Hãy khám phá các tour của chúng tôi ngay hôm nay!" 
            : "Nhập email của bạn để xem danh sách đặt tour"}
        </NoBookingsMessage>
      )}

      {showCancelModal && (
        <Modal>
          <ModalContent>
            <h3>Xác nhận hủy chuyến bay</h3>
            <p>Bạn có chắc chắn muốn hủy chuyến bay từ {selectedBooking?.departureCity} đến {selectedBooking?.arrivalCity}?</p>
            <CancelReasonInput
              placeholder="Vui lòng nhập lý do hủy chuyến bay"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              required
            />
            <ModalButtons>
              <ConfirmButton onClick={handleCancelConfirm}>
                Xác nhận hủy
              </ConfirmButton>
              <CancelButton onClick={() => {
                setShowCancelModal(false);
                setCancelReason("");
                setSelectedBooking(null);
              }}>
                Quay lại
              </CancelButton>
            </ModalButtons>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default ManageBooking; 