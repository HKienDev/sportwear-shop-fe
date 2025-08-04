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
  Link,
  Hr,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import * as React from 'react';

interface PasswordChangedEmailProps {
  name?: string;
  time?: string;
}

const PasswordChangedEmail: React.FC<PasswordChangedEmailProps> = ({
  name = 'Khách hàng',
  time = new Date().toLocaleString('vi-VN'),
}) => {
  return (
    <Html>
      <Head />
      <Preview>Mật khẩu của bạn đã được thay đổi thành công</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-10 max-w-[600px] rounded-lg bg-white p-8 shadow-lg">
            <Section style={{ background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)', borderRadius: 12, padding: '24px 0 12px 0', marginBottom: 24 }}>
              <Img
                src="https://sport-store.vercel.app/vju-logo-main.png"
                width="160"
                height="auto"
                alt="Sport Store Logo"
                className="mx-auto mb-2"
              />
              <Heading style={{ color: '#fff', fontWeight: 700, fontSize: 26, margin: 0 }}>Mật khẩu đã được thay đổi</Heading>
            </Section>
            <Section className="text-center">
              <Text className="text-gray-600">
                Xin chào <Text style={{ fontWeight: 'bold', display: 'inline' }}>{name}</Text>,
              </Text>
              <Text className="mt-2 text-gray-600">
                Chúng tôi xác nhận rằng mật khẩu tài khoản Khánh Hoàn Shop của bạn đã được thay đổi thành công vào lúc {time}.
              </Text>
            </Section>

            <Section className="mt-8 rounded-lg bg-green-50 p-6" style={{ border: '2px solid #22c55e', boxShadow: '0 2px 8px 0 #22c55e22' }}>
              <Text className="text-center text-green-700">
                <Text style={{ fontWeight: 'bold', display: 'inline' }}>Thay đổi mật khẩu thành công!</Text>
              </Text>
              <Text className="mt-2 text-center text-sm text-green-700">
                Bây giờ bạn có thể đăng nhập bằng mật khẩu mới của mình.
              </Text>
            </Section>

            <Section className="mt-8 rounded-lg bg-blue-50 p-4">
              <Text className="text-sm text-blue-700">
                <Text style={{ fontWeight: 'bold', display: 'inline' }}>Lời khuyên bảo mật:</Text> Luôn chọn mật khẩu mạnh và không sử dụng lại mật khẩu trên nhiều trang web khác nhau.
              </Text>
            </Section>

            <Section className="mt-8 text-center">
              <Link 
                href="https://sport-store.vercel.app/auth/login" 
                style={{
                  display: 'inline-block',
                  borderRadius: 8,
                  background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
                  padding: '14px 36px',
                  fontWeight: 600,
                  fontSize: 16,
                  color: '#fff',
                  boxShadow: '0 2px 8px 0 #2563eb22',
                  textDecoration: 'none',
                  margin: '0 auto'
                }}
              >
                Đăng nhập ngay
              </Link>
              <Text className="mt-6 text-sm text-gray-600">
                Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ ngay với chúng tôi qua email: <Link href="mailto:support@sportstore.com" className="text-blue-600 underline">support@sportstore.com</Link>
              </Text>
            </Section>

            <Hr style={{ borderTop: '1.5px solid #e5e7eb', margin: '32px 0 16px 0' }} />

            <Section className="text-center">
              <Text className="text-xs text-gray-500">
                © 2025 Khánh Hoàn Shop. Tất cả các quyền được bảo lưu.
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

export default PasswordChangedEmail; 