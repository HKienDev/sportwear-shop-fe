# VJU Sport Store - E-commerce Platform

A modern, full-stack e-commerce platform built with Next.js 15+, React 19+, and TypeScript. Features real-time chat, advanced search, payment integration, and comprehensive admin dashboard.

## 🏗️ Architecture Overview

### Frontend Stack
- **Framework**: Next.js 15.3.1 (App Router, SSR, API Routes)
- **Language**: TypeScript 5.x
- **UI Library**: React 19.1.0 with modern hooks
- **Styling**: TailwindCSS 3.4.1 with custom design system
- **State Management**: React Context API + Custom Hooks
- **Real-time**: Socket.IO Client 4.8.1
- **Authentication**: NextAuth.js 4.24.11 (JWT + Google OAuth)
- **Payment**: Stripe Integration
- **Validation**: Zod 3.24.2 + React Hook Form 7.55.0
- **UI Components**: Radix UI + Custom Components
- **Charts**: Recharts 2.15.1 + Chart.js 4.4.8
- **HTTP Client**: Axios 1.9.0 with interceptors
- **Animations**: Framer Motion 12.7.4

### Backend Integration
- **API**: RESTful APIs with proper error handling
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.IO Server
- **Authentication**: JWT with role-based access control
- **File Upload**: Cloudinary integration
- **Email**: Nodemailer with custom templates

## 🚀 Key Features

### Customer Experience
- **Advanced Search**: Real-time product search with SKU filtering
- **Shopping Cart**: Persistent cart with real-time updates
- **Payment Processing**: VNPay integration with secure checkout
- **User Management**: Profile management, order history, membership tiers
- **Real-time Chat**: Live customer support with admin interface
- **Reviews & Ratings**: Product review system with moderation
- **Responsive Design**: Mobile-first approach with modern UI/UX

### Admin Dashboard
- **Product Management**: CRUD operations with image upload
- **Order Management**: Real-time order tracking and status updates
- **Customer Management**: User analytics and profile management
- **Analytics Dashboard**: Sales metrics, user statistics, revenue tracking
- **Chat Support**: Real-time customer support interface
- **Inventory Management**: Stock tracking and low stock alerts
- **Coupon System**: Discount management and validation

### Technical Excellence
- **Type Safety**: Full TypeScript implementation
- **Performance**: Image optimization, lazy loading, code splitting
- **SEO**: Meta tags, structured data, server-side rendering
- **Security**: JWT authentication, input validation, CORS
- **Error Handling**: Comprehensive error boundaries and logging
- **Testing**: ESLint configuration, code quality standards

## 📁 Project Structure

```
sport-store/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (admin)/           # Admin routes with layout
│   │   ├── (user)/            # User routes with layout
│   │   ├── api/               # API routes (serverless)
│   │   ├── auth/              # Authentication pages
│   │   └── error-pages/       # Error handling
│   ├── components/            # Reusable UI components
│   │   ├── admin/            # Admin-specific components
│   │   ├── user/             # User-specific components
│   │   ├── common/           # Shared components
│   │   └── ui/               # Base UI components
│   ├── context/              # React Context providers
│   ├── hooks/                # Custom React hooks
│   ├── services/             # API service layer
│   ├── utils/                # Utility functions
│   ├── types/                # TypeScript definitions
│   ├── schemas/              # Zod validation schemas
│   └── lib/                  # Third-party integrations
├── public/                   # Static assets
└── config files              # Next.js, TypeScript, ESLint
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB instance
- Cloudinary account
- Stripe account (for payments)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/HKienDev/sport-store-fe-graduation.git
cd sport-store-fe-graduation/sport-store
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create `.env.local` with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXT_PUBLIC_AUTH_COOKIE_NAME=accessToken
NEXT_PUBLIC_REFRESH_COOKIE_NAME=refreshToken

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your_google_secret

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Start development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
npm start
```

## 🔧 Advanced Features

### Real-time Chat System
- Socket.IO implementation for live messaging
- Guest user support with temporary sessions
- Admin chat interface with conversation management
- Message persistence and read status tracking

### Advanced Search
- Real-time product search with debouncing
- SKU-based filtering and display
- Responsive search dropdown with keyboard navigation
- Search result caching and optimization

### Payment Integration
- VNPay payment gateway integration
- Secure checkout process with validation
- Order confirmation and email notifications
- Payment status tracking and updates

### Admin Dashboard
- Comprehensive analytics and reporting
- Real-time order management
- Customer support interface
- Inventory and product management
- User analytics and membership tracking

## 🚀 Performance Optimizations

- **Image Optimization**: Next.js Image component with Cloudinary
- **Code Splitting**: Dynamic imports and lazy loading
- **Caching**: API response caching and localStorage management
- **Bundle Optimization**: Tree shaking and dead code elimination
- **SEO**: Server-side rendering and meta tag optimization

## 🔒 Security Features

- **Authentication**: JWT-based authentication with refresh tokens
- **Authorization**: Role-based access control (Admin/User)
- **Input Validation**: Zod schemas for all user inputs
- **CORS**: Proper cross-origin resource sharing configuration
- **XSS Protection**: Content Security Policy implementation
- **Rate Limiting**: API rate limiting and abuse prevention

## 📊 Code Quality

- **TypeScript**: Full type safety across the application
- **ESLint**: Code quality and consistency enforcement
- **Prettier**: Code formatting and style consistency
- **Error Boundaries**: Comprehensive error handling
- **Logging**: Structured logging for debugging and monitoring

## 🧪 Testing Strategy

- **Unit Testing**: Component testing with Jest
- **Integration Testing**: API route testing
- **E2E Testing**: User flow testing with Cypress
- **Performance Testing**: Lighthouse CI integration

## 📈 Monitoring & Analytics

- **Error Tracking**: Sentry integration for error monitoring
- **Performance Monitoring**: Core Web Vitals tracking
- **User Analytics**: User behavior and conversion tracking
- **Server Monitoring**: API performance and uptime monitoring

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Hoàng Kiên**
- Email: hoangtientrungkien2k3@gmail.com
- LinkedIn: [Hoàng Kiên](https://www.linkedin.com/in/hoang-kien/)
- GitHub: [@HKienDev](https://github.com/HKienDev)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- TailwindCSS for the utility-first CSS framework
- All contributors and supporters

---

**Built with ❤️ using Next.js, React, and TypeScript**
