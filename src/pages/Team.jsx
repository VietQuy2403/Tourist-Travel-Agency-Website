import React from 'react'

function DoiNgu() {
  return (
    <div>
        <div className="container-fluid bg-primary py-5 mb-5 hero-header">
    <div className="container py-5">
      <div className="row justify-content-center py-5">
        <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
          <h1 className="display-3 text-white animated slideInDown">Hướng Dẫn Viên</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center">
              <li className="breadcrumb-item">
                <a href="/">Trang Chủ</a>
              </li>
              <li
                className="breadcrumb-item text-white active"
                aria-current="page"
              >
                Hướng Dẫn Du Lịch
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
  </div>
      {/* Đội Ngũ Bắt Đầu */}
      <div className="container-xxl py-5">
      <div className="container">
        <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
          <h6 className="section-title bg-white text-center text-primary px-3">
            Hướng Dẫn Viên Du Lịch
          </h6>
          <h1 className="mb-5">Gặp Gỡ Đội Ngũ Chúng Tôi</h1>
        </div>
        <div className="row g-4">
          {[1, 2, 3, 4, 2, 3, 4, 1].map((num, index) => (
            <div className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay={`${0.1 + index * 0.2}s`} key={index}>
              <div className="team-item">
                <div className="overflow-hidden">
                  <img className="img-fluid" src={`assets/img/team-${num}.jpg`} alt="" />
                </div>
                <div
                  className="position-relative d-flex justify-content-center"
                  style={{ marginTop: "-19px" }}
                >
                  <a className="btn btn-square mx-1" href="">
                    <i className="fab fa-facebook-f" />
                  </a>
                  <a className="btn btn-square mx-1" href="">
                    <i className="fab fa-twitter" />
                  </a>
                  <a className="btn btn-square mx-1" href="">
                    <i className="fab fa-instagram" />
                  </a>
                </div>
                <div className="text-center p-4">
                  <h5 className="mb-0">Họ Tên</h5>
                  <small>Chức Danh</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    {/* Đội Ngũ Kết Thúc */}
    </div>
  )
}

export default DoiNgu
