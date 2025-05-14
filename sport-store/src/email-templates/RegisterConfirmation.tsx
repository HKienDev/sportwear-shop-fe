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
  Button,
  Link,
  Hr,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import * as React from 'react';

interface RegisterConfirmationProps {
  fullname: string;
  email: string;
  customId: string;
}

const RegisterConfirmation: React.FC<RegisterConfirmationProps> = ({
  fullname,
  email,
  customId,
}) => {
  return (
    <Html>
      <Head />
      <Preview>Chào mừng bạn đến với Sport Store! Xác nhận đăng ký tài khoản</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-10 max-w-[600px] rounded-lg bg-white p-8 shadow-lg">
            <Section className="text-center">
              <Img
                src="https://sport-store.vercel.app/Logo_vju.png"
                width="160"
                height="auto"
                alt="Sport Store Logo"
                className="mx-auto mb-6"
              />
              <Heading className="text-2xl font-bold text-gray-900">
                Chào mừng đến với Sport Store!
              </Heading>
              <Text className="text-gray-600">
                Xin chào <span className="font-semibold">{fullname}</span>,
              </Text>
              <Text className="mt-2 text-gray-600">
                Chúng tôi rất vui mừng khi bạn đã tham gia cùng chúng tôi. Tài khoản của bạn đã được tạo thành công.
              </Text>
            </Section>

            <Section className="mt-8 rounded-lg bg-blue-50 p-6">
              <Heading className="mb-4 text-lg font-semibold text-blue-800">
                Thông tin tài khoản của bạn
              </Heading>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <Text className="mb-2 text-sm font-medium text-gray-500">
                  Mã khách hàng
                </Text>
                <Text className="mb-4 font-semibold text-gray-800">
                  {customId}
                </Text>
                
                <Text className="mb-2 text-sm font-medium text-gray-500">
                  Email
                </Text>
                <Text className="font-semibold text-gray-800">
                  {email}
                </Text>
              </div>
            </Section>

            <Section className="mt-8 text-center">
              <Link 
                href="https://sport-store.vercel.app/auth/login" 
                className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-center font-medium text-white shadow-sm hover:bg-blue-700"
              >
                Đăng nhập ngay
              </Link>
              <Text className="mt-6 text-sm text-gray-600">
                Nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ, hãy liên hệ với chúng tôi qua email: support@sportstore.com
              </Text>
            </Section>

            <Hr className="my-8 border-gray-200" />

            <Section className="text-center">
              <Text className="text-xs text-gray-500">
                © 2025 Sport Store. Tất cả các quyền được bảo lưu.
              </Text>
              <Text className="mt-1 text-xs text-gray-500">
                Địa chỉ: 97 Đường Võ Văn Tần, Phường 6, Quận 3, Thành phố Hồ Chí Minh
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default RegisterConfirmation; 