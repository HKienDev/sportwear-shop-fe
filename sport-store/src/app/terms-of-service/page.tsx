import React from 'react';
import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-10">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Điều Khoản Sử Dụng
            </h1>
            <p className="text-gray-600 text-lg">
              Điều khoản rõ ràng, minh bạch cho mọi giao dịch
            </p>
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-purple-50 rounded-full">
              <span className="text-sm text-purple-600 font-medium">
                Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>

          <div className="space-y-10">
            {/* Giới thiệu */}
            <section className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-xl border-l-4 border-purple-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-500 text-white rounded-full mr-3 text-sm font-bold">1</span>
                Điều Khoản Chung
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                Bằng việc truy cập và sử dụng website SportWear Shop, bạn đồng ý tuân thủ và bị ràng buộc 
                bởi các điều khoản và điều kiện này. Nếu bạn không đồng ý với bất kỳ phần nào của các 
                điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.
              </p>
            </section>

            {/* Định nghĩa */}
            <section className="bg-gradient-to-r from-indigo-50 to-blue-50 p-8 rounded-xl border-l-4 border-indigo-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-indigo-500 text-white rounded-full mr-3 text-sm font-bold">2</span>
                Định Nghĩa
              </h2>
              <div className="space-y-6">
                <div className="bg-white/60 p-6 rounded-lg border border-indigo-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    "Chúng tôi", "Công ty", "SportWear Shop"
                  </h3>
                  <p className="text-gray-700">Chỉ SportWear Shop và các đơn vị liên quan.</p>
                </div>
                <div className="bg-white/60 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    "Bạn", "Khách hàng", "Người dùng"
                  </h3>
                  <p className="text-gray-700">Chỉ cá nhân hoặc tổ chức sử dụng dịch vụ của chúng tôi.</p>
                </div>
                <div className="bg-white/60 p-6 rounded-lg border border-purple-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                    </svg>
                    "Dịch vụ"
                  </h3>
                  <p className="text-gray-700">Chỉ website, ứng dụng và các dịch vụ khác do SportWear Shop cung cấp.</p>
                </div>
              </div>
            </section>

            {/* Đăng ký tài khoản */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Đăng Ký Tài Khoản
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Để sử dụng một số tính năng của website, bạn cần đăng ký tài khoản. Khi đăng ký, bạn cam kết:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Cung cấp thông tin chính xác, đầy đủ và cập nhật</li>
                  <li>Bảo mật thông tin đăng nhập của mình</li>
                  <li>Chịu trách nhiệm cho tất cả hoạt động diễn ra dưới tài khoản của bạn</li>
                  <li>Thông báo ngay lập tức nếu phát hiện vi phạm bảo mật</li>
                  <li>Không chia sẻ tài khoản với người khác</li>
                </ul>
              </div>
            </section>

            {/* Sử dụng dịch vụ */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Sử Dụng Dịch Vụ
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Bạn được phép sử dụng dịch vụ của chúng tôi cho mục đích hợp pháp và phù hợp với các điều khoản này.
                </p>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Bạn không được phép:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Sử dụng dịch vụ cho mục đích bất hợp pháp</li>
                    <li>Vi phạm quyền sở hữu trí tuệ của chúng tôi hoặc bên thứ ba</li>
                    <li>Gây quá tải hoặc làm gián đoạn hệ thống</li>
                    <li>Thu thập thông tin cá nhân của người khác</li>
                    <li>Phát tán nội dung độc hại, khiêu dâm hoặc bạo lực</li>
                    <li>Giả mạo danh tính hoặc thông tin</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Mua hàng và thanh toán */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Mua Hàng Và Thanh Toán
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">5.1. Đặt hàng</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Đơn hàng chỉ có hiệu lực khi được chúng tôi xác nhận</li>
                    <li>Chúng tôi có quyền từ chối đơn hàng không hợp lệ</li>
                    <li>Giá cả có thể thay đổi mà không báo trước</li>
                    <li>Hình ảnh sản phẩm chỉ mang tính chất minh họa</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">5.2. Thanh toán</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Chúng tôi chấp nhận các phương thức thanh toán được liệt kê</li>
                    <li>Thanh toán phải được hoàn tất trước khi giao hàng</li>
                    <li>Thông tin thanh toán được bảo mật theo tiêu chuẩn PCI DSS</li>
                    <li>Phí vận chuyển được tính theo quy định hiện hành</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Giao hàng */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Giao Hàng
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Chúng tôi cam kết giao hàng trong thời gian đã thông báo, tuy nhiên:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Thời gian giao hàng có thể bị ảnh hưởng bởi yếu tố khách quan</li>
                  <li>Khách hàng chịu trách nhiệm cung cấp địa chỉ giao hàng chính xác</li>
                  <li>Phí giao hàng được tính theo khoảng cách và trọng lượng</li>
                  <li>Chúng tôi không chịu trách nhiệm nếu khách hàng không có mặt khi giao hàng</li>
                </ul>
              </div>
            </section>

            {/* Đổi trả và bảo hành */}
            <section className="bg-gradient-to-r from-amber-50 to-yellow-50 p-8 rounded-xl border-l-4 border-amber-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-amber-500 text-white rounded-full mr-3 text-sm font-bold">7</span>
                Đổi Trả Và Bảo Hành
              </h2>
              <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-8 rounded-xl border-2 border-amber-200 shadow-lg">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white/80 p-6 rounded-lg border border-amber-300">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <svg className="w-6 h-6 text-amber-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Chính sách đổi trả
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                        Đổi trả trong vòng 30 ngày kể từ ngày nhận hàng
                      </li>
                      <li className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                        Sản phẩm phải còn nguyên vẹn, chưa sử dụng
                      </li>
                      <li className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                        Không áp dụng cho sản phẩm đã được tùy chỉnh
                      </li>
                      <li className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                        Phí vận chuyển đổi trả do khách hàng chịu
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white/80 p-6 rounded-lg border border-yellow-300">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <svg className="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Chính sách bảo hành
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                        Bảo hành theo chính sách của nhà sản xuất
                      </li>
                      <li className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                        Thời gian bảo hành được ghi rõ trên sản phẩm
                      </li>
                      <li className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                        Chỉ bảo hành lỗi kỹ thuật từ nhà sản xuất
                      </li>
                      <li className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                        Không bảo hành lỗi do sử dụng không đúng cách
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Quyền sở hữu trí tuệ */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Quyền Sở Hữu Trí Tuệ
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Tất cả nội dung trên website, bao gồm nhưng không giới hạn ở văn bản, hình ảnh, 
                logo, thiết kế, phần mềm và cơ sở dữ liệu, đều thuộc quyền sở hữu của SportWear Shop 
                hoặc được cấp phép sử dụng.
              </p>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Lưu ý:</strong> Việc sao chép, phân phối hoặc sử dụng nội dung mà không có 
                  sự cho phép bằng văn bản là vi phạm quyền sở hữu trí tuệ và có thể bị xử lý theo pháp luật.
                </p>
              </div>
            </section>

            {/* Giới hạn trách nhiệm */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Giới Hạn Trách Nhiệm
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Trong phạm vi cho phép của pháp luật, SportWear Shop không chịu trách nhiệm về:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Thiệt hại gián tiếp hoặc hậu quả phát sinh</li>
                  <li>Mất mát dữ liệu hoặc lỗi hệ thống</li>
                  <li>Hành vi của bên thứ ba</li>
                  <li>Sự cố không thể lường trước được</li>
                  <li>Thiệt hại do sử dụng không đúng cách</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  Tổng trách nhiệm của chúng tôi không vượt quá số tiền bạn đã thanh toán cho đơn hàng đó.
                </p>
              </div>
            </section>

            {/* Bảo mật */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Bảo Mật
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn theo Chính sách bảo mật. 
                Việc sử dụng dịch vụ đồng nghĩa với việc bạn đồng ý với chính sách bảo mật của chúng tôi.
              </p>
            </section>

            {/* Chấm dứt dịch vụ */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Chấm Dứt Dịch Vụ
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Chúng tôi có quyền tạm ngưng hoặc chấm dứt tài khoản của bạn nếu:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Vi phạm các điều khoản này</li>
                <li>Thực hiện hành vi gian lận hoặc bất hợp pháp</li>
                <li>Gây hại cho hệ thống hoặc người dùng khác</li>
                <li>Không hoạt động trong thời gian dài</li>
              </ul>
            </section>

            {/* Luật áp dụng */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                12. Luật Áp Dụng
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Các điều khoản này được điều chỉnh và giải thích theo luật pháp Việt Nam. 
                Mọi tranh chấp phát sinh sẽ được giải quyết tại tòa án có thẩm quyền tại Việt Nam.
              </p>
            </section>

            {/* Liên hệ */}
            <section className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-xl border-l-4 border-purple-500">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-500 text-white rounded-full mr-3 text-sm font-bold">13</span>
                Liên Hệ
              </h2>
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-8 rounded-xl border-2 border-purple-200 shadow-lg">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500 rounded-full mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Liên Hệ Với Chúng Tôi</h3>
                  <p className="text-gray-600">
                    Nếu bạn có bất kỳ câu hỏi nào về điều khoản sử dụng này, 
                    vui lòng liên hệ với chúng tôi:
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/80 p-6 rounded-lg border border-purple-300 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-500 rounded-full mb-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">Email</h4>
                    <p className="text-purple-600 font-medium">legal@sportwear-shop.com</p>
                  </div>
                  <div className="bg-white/80 p-6 rounded-lg border border-purple-300 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-500 rounded-full mb-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">Điện Thoại</h4>
                    <p className="text-purple-600 font-medium">1900-xxxx</p>
                  </div>
                  <div className="bg-white/80 p-6 rounded-lg border border-purple-300 text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-500 rounded-full mb-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">Địa Chỉ</h4>
                    <p className="text-purple-600 font-medium">123 Đường ABC, Quận XYZ, TP.HCM</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Cập nhật điều khoản */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                14. Cập Nhật Điều Khoản
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Chúng tôi có quyền cập nhật các điều khoản này theo thời gian. 
                Những thay đổi sẽ được thông báo trên website và có hiệu lực ngay khi đăng tải. 
                Việc tiếp tục sử dụng dịch vụ sau khi cập nhật đồng nghĩa với việc bạn chấp nhận 
                điều khoản mới.
              </p>
            </section>
          </div>


        </div>
      </div>
    </div>
  );
}
