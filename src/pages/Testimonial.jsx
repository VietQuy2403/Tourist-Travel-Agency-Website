import React from 'react'

function LoiChung() {
  return (
    <div>
      <div className="container-fluid bg-primary py-5 mb-5 hero-header">
        <div className="container py-5">
          <div className="row justify-content-center py-5">
            <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
              <h1 className="display-3 text-white animated slideInDown">
                Lời Chứng
              </h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center">
                  <li className="breadcrumb-item">
                    <a href="/">Trang Chủ</a>
                  </li>
                  <li className="breadcrumb-item text-white active" aria-current="page">
                    Lời Chứng
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      
      {/* Lời Chứng Bắt Đầu */}
      <div className="container-xxl py-5 wow fadeInUp" data-wow-delay="0.1s">
        <div className="container">
          <div className="text-center">
            <h6 className="section-title bg-white text-center text-primary px-3">
              Lời Chứng
            </h6>
            <h1 className="mb-5">Khách Hàng Của Chúng Tôi Nói Gì!!!</h1>
          </div>
          <div className="owl-carousel testimonial-carousel position-relative">
            <div className="testimonial-item bg-white text-center border p-4">
              <img alt='im' className="bg-white rounded-circle shadow p-1 mx-auto mb-3" src="assets/img/testimonial-1.jpg" style={{ width: 80, height: 80 }} />
              <h5 className="mb-0">John Doe</h5>
              <p>New York, USA</p>
              <p className="mb-0">
                Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit diam amet diam et eos. Clita erat ipsum et lorem et sit.
              </p>
            </div>
            <div className="testimonial-item bg-white text-center border p-4">
              <img alt='im' className="bg-white rounded-circle shadow p-1 mx-auto mb-3" src="assets/img/testimonial-2.jpg" style={{ width: 80, height: 80 }} />
              <h5 className="mb-0">John Doe</h5>
              <p>New York, USA</p>
              <p className="mt-2 mb-0">
                Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit diam amet diam et eos. Clita erat ipsum et lorem et sit.
              </p>
            </div>
            <div className="testimonial-item bg-white text-center border p-4">
              <img alt='im' className="bg-white rounded-circle shadow p-1 mx-auto mb-3" src="assets/img/testimonial-3.jpg" style={{ width: 80, height: 80 }} />
              <h5 className="mb-0">John Doe</h5>
              <p>New York, USA</p>
              <p className="mt-2 mb-0">
                Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit diam amet diam et eos. Clita erat ipsum et lorem et sit.
              </p>
            </div>
            <div className="testimonial-item bg-white text-center border p-4">
              <img alt='im' className="bg-white rounded-circle shadow p-1 mx-auto mb-3" src="assets/img/testimonial-4.jpg" style={{ width: 80, height: 80 }} />
              <h5 className="mb-0">John Doe</h5>
              <p>New York, USA</p>
              <p className="mt-2 mb-0">
                Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit diam amet diam et eos. Clita erat ipsum et lorem et sit.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Lời Chứng Kết Thúc */}
    </div>
  )
}

export default LoiChung
