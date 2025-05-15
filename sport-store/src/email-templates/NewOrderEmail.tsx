import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Row,
  Column,
  Link,
  Hr,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import * as React from 'react';
import { formatCurrency } from '@/lib/utils';

interface OrderItem {
  product: {
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}

interface Order {
  _id: string;
  shortId: string;
  user: {
    name: string;
    email: string;
  };
  items: OrderItem[];
  subtotal: number;
  directDiscount: number;
  couponDiscount: number;
  shippingFee: number;
  totalPrice: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: {
      street: string;
      ward: {
        name: string;
      };
      district: {
        name: string;
      };
      province: {
        name: string;
      };
    };
  };
  shippingMethod: {
    method: string;
    fee: number;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
}

interface NewOrderEmailProps {
  order: Order;
}

const NewOrderEmail: React.FC<NewOrderEmailProps> = ({ order }) => {
  // Tính thời gian dự kiến giao hàng (3-5 ngày từ ngày đặt hàng)
  const deliveryDate = new Date(order.createdAt);
  deliveryDate.setDate(deliveryDate.getDate() + 4); // Mặc định 4 ngày

  return (
    <Html>
      <Head />
      <Preview>Xác nhận đơn hàng #{order.shortId} từ Sport Store</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-10 max-w-[650px] rounded-lg bg-white p-8 shadow-lg">
            <Section className="text-center">
              <Img
                src="https://sport-store.vercel.app/vju-logo-main.png"
                width="160"
                height="auto"
                alt="Sport Store Logo"
                className="mx-auto mb-7"
              />
              <Heading className="text-2xl font-bold text-gray-900">
                Xin chào {order.shippingAddress.fullName}!
              </Heading>
              <Text className="text-gray-600">
                Cảm ơn bạn đã đặt hàng tại{' '}
                <span className="font-semibold text-blue-600">Sport Store</span>
              </Text>
              <Text className="mt-2 text-sm text-gray-500">
                Chúng tôi đã nhận được đơn hàng của bạn và đang xử lý.
              </Text>
            </Section>

            <Section className="mt-8 rounded-lg bg-blue-50 p-4">
              <Row>
                <Column>
                  <Text className="text-xs uppercase text-blue-600">
                    Mã đơn hàng
                  </Text>
                  <Text className="text-lg font-semibold text-blue-800">
                    #{order.shortId}
                  </Text>
                </Column>
                <Column>
                  <Text className="text-xs uppercase text-blue-600">
                    Ngày đặt hàng
                  </Text>
                  <Text className="text-lg font-medium text-blue-800">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </Text>
                </Column>
                <Column>
                  <Text className="text-xs uppercase text-blue-600">
                    Dự kiến giao
                  </Text>
                  <Text className="text-lg font-medium text-blue-800">
                    {deliveryDate.toLocaleDateString('vi-VN')}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr style={hr} />

            <Section className="mt-8">
              <Heading className="mb-6 border-l-4 border-blue-500 pl-3 text-lg font-bold text-gray-900">
                Chi tiết đơn hàng
              </Heading>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-4 text-left text-sm font-bold uppercase text-gray-600">
                        Sản phẩm
                      </th>
                      <th className="p-4 text-center text-sm font-bold uppercase text-gray-600">
                        Số lượng
                      </th>
                      <th className="p-4 text-right text-sm font-bold uppercase text-gray-600">
                        Thành tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200 transition-colors hover:bg-gray-50"
                      >
                        <td className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                              <Img
                                src={item.product.image}
                                alt={item.product.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <Text className="font-semibold text-gray-900">
                                {item.product.name}
                              </Text>
                              <Text className="mt-1 text-sm text-gray-500">
                                {formatCurrency(item.product.price)} / sản phẩm
                              </Text>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center font-medium text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="p-4 text-right font-semibold text-gray-900">
                          {formatCurrency(item.product.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section className="mt-8 rounded-lg bg-gray-50 p-5">
              <Row>
                <Column>
                  <Text className="text-sm text-gray-600">Tổng tiền hàng:</Text>
                </Column>
                <Column align="right">
                  <Text className="text-sm font-medium text-gray-900">
                    {formatCurrency(order.subtotal)}
                  </Text>
                </Column>
              </Row>
              {order.directDiscount > 0 && (
                <Row className="mt-2">
                  <Column>
                    <Text className="text-sm text-gray-600">Giảm giá:</Text>
                  </Column>
                  <Column align="right">
                    <Text className="text-sm font-medium text-green-600">
                      -{formatCurrency(order.directDiscount)}
                    </Text>
                  </Column>
                </Row>
              )}
              {order.couponDiscount > 0 && (
                <Row className="mt-2">
                  <Column>
                    <Text className="text-sm text-gray-600">Mã giảm giá:</Text>
                  </Column>
                  <Column align="right">
                    <Text className="text-sm font-medium text-green-600">
                      -{formatCurrency(order.couponDiscount)}
                    </Text>
                  </Column>
                </Row>
              )}
              <Row className="mt-2">
                <Column>
                  <Text className="text-sm text-gray-600">Phí vận chuyển:</Text>
                </Column>
                <Column align="right">
                  <Text className="text-sm font-medium text-gray-900">
                    {formatCurrency(order.shippingFee)}
                  </Text>
                </Column>
              </Row>
              <Hr style={hr} />
              <Row className="mt-2">
                <Column>
                  <Text className="text-base font-bold text-gray-900">
                    Tổng thanh toán:
                  </Text>
                </Column>
                <Column align="right">
                  <Text className="text-base font-bold text-blue-600">
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr style={hr} />

            <Section className="mt-8">
              <Heading className="mb-6 border-l-4 border-green-500 pl-3 text-lg font-bold text-gray-900">
                Thông tin giao hàng
              </Heading>
              <div className="rounded-lg bg-gray-50 p-5">
                <Text className="font-medium text-gray-900 leading-relaxed">
                  <span className="font-semibold">Người nhận:</span> {order.shippingAddress.fullName}
                  <br />
                  <span className="font-semibold">Số điện thoại:</span> {order.shippingAddress.phone}
                  <br />
                  <span className="font-semibold">Địa chỉ:</span> {order.shippingAddress.address.street}, {order.shippingAddress.address.ward.name}, {order.shippingAddress.address.district.name}, {order.shippingAddress.address.province.name}
                  <br />
                  <span className="font-semibold">Phương thức vận chuyển:</span> {order.shippingMethod.method === 'standard' ? 'Tiêu chuẩn' : order.shippingMethod.method === 'express' ? 'Nhanh' : 'Hôm nay'}
                </Text>
              </div>
            </Section>

            <Section className="mt-8">
              <Heading className="mb-6 border-l-4 border-purple-500 pl-3 text-lg font-bold text-gray-900">
                Phương thức thanh toán
              </Heading>
              <div className="rounded-lg bg-gray-50 p-5">
                <Text className="font-medium text-gray-900 leading-relaxed">
                  <span className="font-semibold">Phương thức:</span> {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : 'Thanh toán qua Stripe'}
                  <br />
                  <span className="font-semibold">Trạng thái:</span> {order.paymentStatus === 'pending' ? 'Chờ thanh toán' : order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Thanh toán thất bại'}
                </Text>
              </div>
            </Section>

            <Section className="mt-8 text-center">
              <Link
                href={`https://sport-store.vercel.app/orders/${order._id}`}
                className="inline-block rounded-full bg-blue-600 px-8 py-3 text-white shadow-lg transition-colors hover:bg-blue-700"
              >
                Xem chi tiết đơn hàng
              </Link>
            </Section>

            <Section className="mt-8 rounded-lg bg-gray-50 p-6 text-center">
              <Heading className="mb-4 text-lg font-semibold text-gray-900">
                Hỗ trợ khách hàng
              </Heading>
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <svg
                      className="h-4 w-4 text-blue-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <Link
                    href="mailto:support@sportstore.com"
                    className="text-blue-500"
                  >
                    support@sportstore.com
                  </Link>
                </div>
                <div className="flex items-center">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <svg
                      className="h-4 w-4 text-blue-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 5.5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5.5z" />
                    </svg>
                  </div>
                  <Link href="tel:0362195258" className="text-blue-500">
                    0362195258
                  </Link>
                </div>
              </div>
            </Section>

            <Section className="mt-8 text-center">
              <Text className="text-sm text-gray-500">
                © 2025 Sport Store. Tất cả các quyền được bảo lưu.
              </Text>
              <Text className="mt-1 text-xs text-gray-500">
                Email này được gửi tự động, vui lòng không trả lời.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default NewOrderEmail;

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
}; 