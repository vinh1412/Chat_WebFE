import React, { useState, useEffect } from 'react';

const slides = [
  {
    title: 'Chào mừng đến với Zalo PC!',
    description: 'Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng người thân, bạn bè được tối ưu hoá cho máy tính của bạn.',
    image: "/images/bg/quick-message-onboard.png",
    subTitle: 'Giao diện Dark Mode',
    subDesc: 'Sử dụng Tin Nhắn Nhanh để lưu sẵn các tin nhắn thường dùng và gửi nhanh trong hội thoại bất kỳ',
  },
  {
    title: 'Chào mừng đến với Zalo PC!',
    description: 'Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng người thân, bạn bè được tối ưu hoá cho máy tính của bạn.',
    image: '/images/bg/zalo-darkmode.PNG',
    subDesc: 'Thư giãn và bảo vệ mắt với chế độ giao diện tối mới trên Zalo PC',
  },
  {
    title: 'Đồng bộ tin nhắn nhanh chóng',
    description: 'Mọi cuộc trò chuyện được đồng bộ giữa điện thoại và máy tính, không lo mất dữ liệu.',
    image: '/images/bg/sync.png',
    subTitle: 'Đồng bộ dễ dàng',
    subDesc: 'Không cần kết nối dây, không cần quét mã nhiều lần',
  },
  {
    title: 'Chào mừng đến với Zalo PC!',
    description: 'Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng người thân, bạn bè được tối ưu hoá cho máy tính của bạn.',
    image: '/images/bg/ctrllfile.png',
    subTitle: 'Gửi File nặng?',
    subDesc: 'Đã có Zalo PC "xử" hết',
  }
];

const OnboardingCarousel = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      nextSlide();
    }, 5000); // Tự động chuyển sau 5 giây

    return () => clearTimeout(timer);
  }, [current]);

  const slide = slides[current];

  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center" style={{ height: '100vh' }}>
      <h3 className="fw-normal">
        {slide.title.includes('Zalo PC') ? (
          <>
            {slide.title.split('Zalo PC')[0]}
            <strong>Zalo PC</strong>
            {slide.title.split('Zalo PC')[1]}
          </>
        ) : slide.title}
      </h3>

      <p className="w-50">{slide.description}</p>

      <div className="position-relative my-4" style={{ width: '360px', height: '228px' }}>
        <img
          src={slide.image}
          alt="Slide"
          className="img-fluid w-100 h-100 rounded"
          style={{ objectFit: 'cover' }}
        />
        <button onClick={prevSlide} className="btn btn-light position-absolute top-50 start-0 translate-middle-y">
          &#8249;
        </button>
        <button onClick={nextSlide} className="btn btn-light position-absolute top-50 end-0 translate-middle-y">
          &#8250;
        </button>
      </div>

      <div>
        <h5 className="text-primary">{slide.subTitle}</h5>
        <p className="text-secondary">
          {slide.subDesc.includes('giao diện') ? (
            <>
              {slide.subDesc.split('giao diện')[0]}
              <strong>giao diện</strong>
              {slide.subDesc.split('giao diện')[1]}
            </>
          ) : slide.subDesc}
        </p>
        <button className="btn btn-primary">Thử ngay</button>
      </div>

      <div className="mt-4 d-flex gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: i === current ? '#0d6efd' : '#ccc'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default OnboardingCarousel;
