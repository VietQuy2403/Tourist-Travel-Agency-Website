import React from 'react'

function Error() {
  return (
    <div>
      <div className="container-fluid bg-primary py-5 mb-5 hero-header">
        <div className="container py-5">
          <div className="row justify-content-center py-5">
            <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
              <h1 className="display-3 text-white animated slideInDown">
                Không tìm thấy
              </h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center">
                  <li className="breadcrumb-item">
                    <a href="/">Trang chủ</a>
                  </li>
                  <li
                    className="breadcrumb-item text-white active"
                    aria-current="page"
                  >
                    404
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* 404 Start */}
      <div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s">
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <i className="bi bi-exclamation-triangle display-1 text-primary" />
              <h1 className="display-1">404</h1>
              <h1 className="mb-4">Không tìm thấy trang</h1>
              <p className="mb-4">
                Chúng tôi xin lỗi, trang bạn đang tìm kiếm không tồn tại trên
                website của chúng tôi! Hãy quay lại trang chủ hoặc thử tìm kiếm?
              </p>
              <a className="btn btn-primary rounded-pill py-3 px-5" href="/Home">
                Quay lại trang chủ
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* 404 End */}
    </div>
  )
}

export default Error
