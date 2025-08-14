import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-10">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Chính Sách Bảo Mật
            </h1>
            <p className="text-gray-600 text-lg">
              Bảo vệ thông tin của bạn là ưu tiên hàng đầu của chúng tôi
            </p>
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-50 rounded-full">
              <span className="text-sm text-blue-600 font-medium">
                Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>

          <div className="space-y-10">
            {/* Giới thiệu */}
            <section className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl border-l-4 border-blue-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full mr-3 text-sm font-bold">1</span>
                Giới Thiệu
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                SportWear Shop cam kết bảo vệ quyền riêng tư và thông tin cá nhân của khách hàng. 
                Chính sách bảo mật này mô tả cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ 
                thông tin của bạn khi sử dụng website và dịch vụ của chúng tôi.
              </p>
            </section>

            {/* Thông tin thu thập */}
            <section className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-xl border-l-4 border-green-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full mr-3 text-sm font-bold">2</span>
                Thông Tin Chúng Tôi Thu Thập
              </h2>
              <div className="space-y-6">
                <div className="bg-white/60 p-6 rounded-lg border border-green-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    2.1. Thông tin cá nhân
                  </h3>
                  <ul className="list-none space-y-2">
                    <li className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Họ tên, địa chỉ email, số điện thoại
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Địa chỉ giao hàng và thanh toán
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Thông tin tài khoản và mật khẩu
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Lịch sử mua hàng và giao dịch
                    </li>
                  </ul>
                </div>
                <div className="bg-white/60 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    2.2. Thông tin tự động
                  </h3>
                  <ul className="list-none space-y-2">
                    <li className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Địa chỉ IP và thông tin thiết bị
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Cookie và dữ liệu duyệt web
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Thông tin về hệ điều hành và trình duyệt
                    </li>
                    <li className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Dữ liệu phân tích website
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Mục đích sử dụng */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Mục Đích Sử Dụng Thông Tin
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Xử lý đơn hàng và giao hàng</li>
                <li>Cung cấp dịch vụ khách hàng</li>
                <li>Gửi thông báo và cập nhật</li>
                <li>Cải thiện trải nghiệm người dùng</li>
                <li>Phân tích và tối ưu hóa website</li>
                <li>Tuân thủ nghĩa vụ pháp lý</li>
              </ul>
            </section>

            {/* Chia sẻ thông tin */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Chia Sẻ Thông Tin
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin cá nhân của bạn cho bên thứ ba 
                mà không có sự đồng ý của bạn, trừ các trường hợp sau:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Đối tác giao hàng và thanh toán</li>
                <li>Nhà cung cấp dịch vụ công nghệ</li>
                <li>Cơ quan thực thi pháp luật khi có yêu cầu</li>
                <li>Bảo vệ quyền lợi và an toàn của chúng tôi</li>
              </ul>
            </section>

            {/* Bảo mật thông tin */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Bảo Mật Thông Tin
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Chúng tôi áp dụng các biện pháp bảo mật tiên tiến để bảo vệ thông tin của bạn:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Mã hóa SSL/TLS cho tất cả giao dịch</li>
                  <li>Bảo mật cơ sở dữ liệu với firewall</li>
                  <li>Kiểm soát truy cập nghiêm ngặt</li>
                  <li>Giám sát bảo mật 24/7</li>
                  <li>Cập nhật bảo mật thường xuyên</li>
                </ul>
              </div>
            </section>

            {/* Cookie */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Sử Dụng Cookie
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Website của chúng tôi sử dụng cookie để cải thiện trải nghiệm người dùng. 
                Bạn có thể kiểm soát cookie thông qua cài đặt trình duyệt.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Các loại cookie chúng tôi sử dụng:</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Cookie cần thiết: Để website hoạt động bình thường</li>
                  <li>Cookie hiệu suất: Để phân tích và cải thiện website</li>
                  <li>Cookie chức năng: Để ghi nhớ tùy chọn của bạn</li>
                </ul>
              </div>
            </section>

            {/* Quyền của khách hàng */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Quyền Của Khách Hàng
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Bạn có các quyền sau đối với thông tin cá nhân của mình:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Quyền truy cập và xem thông tin cá nhân</li>
                <li>Quyền chỉnh sửa và cập nhật thông tin</li>
                <li>Quyền yêu cầu xóa thông tin cá nhân</li>
                <li>Quyền từ chối nhận email marketing</li>
                <li>Quyền khiếu nại về việc xử lý dữ liệu</li>
              </ul>
            </section>

            {/* Liên hệ */}
            <section className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl border-l-4 border-blue-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full mr-3 text-sm font-bold">8</span>
                Liên Hệ
              </h2>
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-8 rounded-xl border-2 border-blue-200 shadow-lg">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Liên Hệ Với Chúng Tôi</h3>
                  <p className="text-gray-600">
                    Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này, 
                    vui lòng liên hệ với chúng tôi:
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/80 p-6 rounded-lg border border-blue-300 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full mb-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">Email</h4>
                    <p className="text-blue-600 font-medium">privacy@sportwear-shop.com</p>
                  </div>
                  <div className="bg-white/80 p-6 rounded-lg border border-blue-300 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full mb-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">Điện Thoại</h4>
                    <p className="text-blue-600 font-medium">1900-xxxx</p>
                  </div>
                  <div className="bg-white/80 p-6 rounded-lg border border-blue-300 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full mb-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">Địa Chỉ</h4>
                    <p className="text-blue-600 font-medium">123 Đường ABC, Quận XYZ, TP.HCM</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Cập nhật chính sách */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Cập Nhật Chính Sách
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. 
                Những thay đổi sẽ được thông báo trên website và có hiệu lực ngay khi đăng tải. 
                Việc tiếp tục sử dụng dịch vụ sau khi cập nhật đồng nghĩa với việc bạn chấp nhận 
                chính sách mới.
              </p>
            </section>
          </div>


        </div>
      </div>
    </div>
  );
}
