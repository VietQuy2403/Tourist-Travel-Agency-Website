import React from 'react'

function LienHe() {
  return (
    <div>
        <div className="container-fluid bg-primary py-5 mb-5 hero-header">
    <div className="container py-5">
      <div className="row justify-content-center py-5">
        <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
          <h1 className="display-3 text-white animated slideInDown">
            Liên Hệ
          </h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center">
              <li className="breadcrumb-item">
                <a href="/">Trang Chủ</a>
              </li>
              <li
                className="breadcrumb-item text-white active"
                aria-current="page"
              >
                Liên Hệ
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
  </div>
      {/* Bắt đầu phần liên hệ */}
      <div className="container-xxl py-5">
      <div className="container">
        <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
          <h6 className="section-title bg-white text-center text-primary px-3">
            Liên Hệ
          </h6>
          <h1 className="mb-5">Liên hệ để được hỗ trợ</h1>
        </div>
        <div className="row g-4">
          <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
            <h5>Thông Tin Liên Hệ</h5>
            <p className="mb-4">
              Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.
            </p>
            <div className="d-flex align-items-center mb-4">
              <div className="d-flex align-items-center justify-content-center flex-shrink-0 bg-primary" style={{ width: 50, height: 50 }}>
                <i className="fa fa-map-marker-alt text-white" />
              </div>
              <div className="ms-3">
                <h5 className="text-primary">Văn Phòng</h5>
                <p className="mb-0">123 Đường ABC, Thành phố XYZ</p>
              </div>
            </div>
            <div className="d-flex align-items-center mb-4">
              <div className="d-flex align-items-center justify-content-center flex-shrink-0 bg-primary" style={{ width: 50, height: 50 }}>
                <i className="fa fa-phone-alt text-white" />
              </div>
              <div className="ms-3">
                <h5 className="text-primary">Số Điện Thoại</h5>
                <p className="mb-0">+012 345 67890</p>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center justify-content-center flex-shrink-0 bg-primary" style={{ width: 50, height: 50 }}>
                <i className="fa fa-envelope-open text-white" />
              </div>
              <div className="ms-3">
                <h5 className="text-primary">Email</h5>
                <p className="mb-0">info@website.com</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
            <iframe className="position-relative rounded w-100 h-100" src="https://www.google.com/maps" frameBorder={0} style={{ minHeight: 300, border: 0 }} allowFullScreen="" aria-hidden="false" tabIndex={0} />
          </div>
          <div className="col-lg-4 col-md-12 wow fadeInUp" data-wow-delay="0.5s">
            <form>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-floating">
                    <input type="text" className="form-control" id="name" placeholder="Họ và Tên" />
                    <label htmlFor="name">Họ và Tên</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-floating">
                    <input type="email" className="form-control" id="email" placeholder="Email của bạn" />
                    <label htmlFor="email">Email</label>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-floating">
                    <input type="text" className="form-control" id="subject" placeholder="Chủ đề" />
                    <label htmlFor="subject">Chủ đề</label>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-floating">
                    <textarea className="form-control" placeholder="Nội dung tin nhắn" id="message" style={{ height: 100 }} />
                    <label htmlFor="message">Tin Nhắn</label>
                  </div>
                </div>
                <div className="col-12">
                  <button className="btn btn-primary w-100 py-3" type="submit">
                    Gửi Tin Nhắn
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    {/* Kết thúc phần liên hệ */}
    </div>
  )
}

export default LienHe
