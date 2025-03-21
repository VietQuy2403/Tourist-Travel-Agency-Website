import React from 'react'

function DichVu() {
  return (
    <div>
      <div className="container-fluid bg-primary py-5 mb-5 hero-header">
        <div className="container py-5">
          <div className="row justify-content-center py-5">
            <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
              <h1 className="display-3 text-white animated slideInDown">
                Dịch Vụ
              </h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center">
                  <li className="breadcrumb-item">
                    <a href="/">Trang Chủ</a>
                  </li>
                  <li className="breadcrumb-item text-white active" aria-current="page">
                    Dịch Vụ
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dịch Vụ Bắt Đầu */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-white text-center text-primary px-3">
              Dịch Vụ
            </h6>
            <h1 className="mb-5">Dịch Vụ Của Chúng Tôi</h1>
          </div>
          <div className="row g-4">
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-globe text-primary mb-4" />
                  <h5>Du Lịch Toàn Cầu</h5>
                  <p>
                    Cung cấp các chuyến du lịch tuyệt vời trên khắp thế giới với giá cả hợp lý.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-hotel text-primary mb-4" />
                  <h5>Đặt Phòng Khách Sạn</h5>
                  <p>
                    Đặt phòng khách sạn chất lượng cao với giá ưu đãi nhất.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.5s">
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-user text-primary mb-4" />
                  <h5>Hướng Dẫn Viên Du Lịch</h5>
                  <p>
                    Hướng dẫn viên chuyên nghiệp giúp bạn tận hưởng chuyến đi trọn vẹn.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.7s">
              <div className="service-item rounded pt-3">
                <div className="p-4">
                  <i className="fa fa-3x fa-cog text-primary mb-4" />
                  <h5>Quản Lý Sự Kiện</h5>
                  <p>
                    Tổ chức sự kiện chuyên nghiệp và sáng tạo theo yêu cầu của bạn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Dịch Vụ Kết Thúc */}
    </div>
  )
}

export default DichVu
