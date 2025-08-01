import React from 'react';

interface QuestionAnsweredEmailProps {
  userName: string;
  productName: string;
  question: string;
  answer: string;
  questionUrl: string;
}

const QuestionAnsweredEmail: React.FC<QuestionAnsweredEmailProps> = ({
  userName,
  productName,
  question,
  answer,
  questionUrl
}) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h1 style={{ color: '#333', margin: '0 0 10px 0', fontSize: '24px' }}>
          Câu hỏi của bạn đã được trả lời! 🎉
        </h1>
        <p style={{ color: '#666', margin: '0', fontSize: '16px' }}>
          Xin chào {userName},
        </p>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e9ecef', marginBottom: '20px' }}>
        <h2 style={{ color: '#333', margin: '0 0 15px 0', fontSize: '20px' }}>
          Thông tin sản phẩm
        </h2>
        <p style={{ color: '#666', margin: '0 0 10px 0', fontSize: '14px' }}>
          <strong>Sản phẩm:</strong> {productName}
        </p>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e9ecef', marginBottom: '20px' }}>
        <h3 style={{ color: '#333', margin: '0 0 10px 0', fontSize: '18px' }}>
          Câu hỏi của bạn:
        </h3>
        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px', marginBottom: '15px' }}>
          <p style={{ color: '#333', margin: '0', fontSize: '14px', lineHeight: '1.5' }}>
            "{question}"
          </p>
        </div>

        <h3 style={{ color: '#333', margin: '0 0 10px 0', fontSize: '18px' }}>
          Trả lời từ chúng tôi:
        </h3>
        <div style={{ backgroundColor: '#e3f2fd', padding: '15px', borderRadius: '6px', borderLeft: '4px solid #2196f3' }}>
          <p style={{ color: '#333', margin: '0', fontSize: '14px', lineHeight: '1.5' }}>
            {answer}
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e9ecef', marginBottom: '20px' }}>
        <h3 style={{ color: '#333', margin: '0 0 15px 0', fontSize: '18px' }}>
          Xem chi tiết
        </h3>
        <p style={{ color: '#666', margin: '0 0 15px 0', fontSize: '14px' }}>
          Bạn có thể xem câu hỏi và trả lời chi tiết tại trang sản phẩm:
        </p>
        <a 
          href={questionUrl} 
          style={{
            display: 'inline-block',
            backgroundColor: '#2196f3',
            color: '#fff',
            padding: '12px 24px',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Xem chi tiết
        </a>
      </div>

      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
        <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>
          Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
        </p>
        <p style={{ color: '#666', margin: '10px 0 0 0', fontSize: '12px' }}>
          Nếu bạn có thêm câu hỏi, đừng ngần ngại liên hệ với chúng tôi.
        </p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px', padding: '20px', borderTop: '1px solid #e9ecef' }}>
        <p style={{ color: '#999', margin: '0', fontSize: '12px' }}>
          Email này được gửi tự động từ hệ thống SportWear Shop.
        </p>
      </div>
    </div>
  );
};

export default QuestionAnsweredEmail; 