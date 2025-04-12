// Configuration file for all URLs used in the website
// This makes it easy to update URLs in one place

export const urls = {
  // Base API URL
  api: {
    baseUrl: process.env.RAILS_API_URL || "https://literally-immortal-sunbird.ngrok-free.app",
    endpoints: {
      // Auth endpoints
      auth: {
        login: "/users/sign_in",
        register: "/users",
        logout: "/users/sign_out",
        passwordReset: "/users/password",
        employeeLogin: "/employees/sign_in",
        employeeRegister: "/employees",
        employeeLogout: "/employees/sign_out",
        employeePasswordReset: "/employees/password",
        currentUser: "/api/current_user",
        googleAuth: "/users/auth/google_oauth2",
        googleAuthEmployee: "/employees/auth/google_oauth2",
      },
      // User endpoints
      user: {
        profile: "/api/user/profile",
        password: "/api/user/password",
      },
      // Blog endpoints
      blog: {
        posts: "/api/blog_posts",
        categories: "/api/blog_categories",
        tags: "/api/blog_tags",
        related: "/api/blog_posts/related",
      },
      // Contact endpoints
      contact: {
        submit: "/api/contact",
      },
      // Newsletter endpoints
      newsletter: {
        subscribe: "/api/newsletter/subscribe",
      },
    },
  },

  // Videos
  videos: {
    landingPage:
      "https://jsxwijazpbcwaystsdgp.supabase.co/storage/v1/object/sign/videos/landing-page-video/6618335-uhd_2560_1440_24fps.mp4?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2aWRlb3MvbGFuZGluZy1wYWdlLXZpZGVvLzY2MTgzMzUtdWhkXzI1NjBfMTQ0MF8yNGZwcy5tcDQiLCJpYXQiOjE3NDQxNDQzMDIsImV4cCI6MTgzMDU0NDMwMn0.VAAW-pCuHsedrtZHFSjiN6cwOC_ZO_R2By5FpGHcMmI",
    heavyMachinery: "/videos/heavy-machinery.mp4",
    coldChainLogistics: "/videos/cold-chain-logistics.mp4",
    projectCargo: "/videos/project-cargo.mp4",
    hazardousGoods: "/videos/hazardous-goods.mp4",
  },

  // Images
  images: {
    // Hero and background images
    logisticsHero: "/images/logistics-hero.jpg",
    aboutCompany: "/images/about-company.jpg",
    historyFoundation: "/images/history-foundation.jpg",
    historyGrowth: "/images/history-growth.jpg",
    historyPresent: "/images/history-present.jpg",

    // Service images
    heavyMachineryTransport: "/placeholder.svg?height=400&width=600",
    crossBorderLogistics: "/placeholder.svg?height=400&width=600",
    roadConstruction: "/placeholder.svg?height=400&width=600",
    heavyMachineryHire: "/placeholder.svg?height=400&width=600",
    coldChainLogistics: "/placeholder.svg?height=400&width=600",
    projectCargo: "/placeholder.svg?height=400&width=600",
    hazardousGoods: "/placeholder.svg?height=400&width=600",
    lastMileDelivery: "/placeholder.svg?height=400&width=600",
    fleetLeasing: "/placeholder.svg?height=400&width=600",

    // Blog images
    blogPlaceholder: "/placeholder.svg?height=400&width=600",
    authorPlaceholder: "/placeholder.svg?height=100&width=100",

    // User/profile images
    userPlaceholder: "/placeholder.svg?height=200&width=200",
    avatarPlaceholder: "/placeholder.svg?height=40&width=40",

    // Partner logos
    partnerLogos: {
      softcare:
        "https://jsxwijazpbcwaystsdgp.supabase.co/storage/v1/object/sign/videos/company-logos/softcare.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2aWRlb3MvY29tcGFueS1sb2dvcy9zb2Z0Y2FyZS5qcGciLCJpYXQiOjE3NDQyOTQwMzksImV4cCI6MTkwMTk3NDAzOX0._rQKV7ZHSFXBQ1JRxK8LAgbgwbzyjlEXuYJKXCVna58",
      malimount:
        "https://jsxwijazpbcwaystsdgp.supabase.co/storage/v1/object/sign/videos/company-logos/malimount.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2aWRlb3MvY29tcGFueS1sb2dvcy9tYWxpbW91bnQuanBnIiwiaWF0IjoxNzQ0MjkzOTk4LCJleHAiOjE5MDE5NzM5OTh9.wwjipc6y0J-G0ljIghKYGL_eBgOEUJFvakyF-YN8kno",
      silvermon:
        "https://jsxwijazpbcwaystsdgp.supabase.co/storage/v1/object/sign/videos/company-logos/silvermon.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2aWRlb3MvY29tcGFueS1sb2dvcy9zaWx2ZXJtb24uanBnIiwiaWF0IjoxNzQ0Mjk0MDIyLCJleHAiOjE5MDE5NzQwMjJ9.NlRWemMx42mlBMN7yLsm4LXTr4AWTLoufWjPOAU5Nug",
      makueniCounty:
        "https://jsxwijazpbcwaystsdgp.supabase.co/storage/v1/object/sign/videos/company-logos/makueni-county.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2aWRlb3MvY29tcGFueS1sb2dvcy9tYWt1ZW5pLWNvdW50eS5qcGciLCJpYXQiOjE3NDQyOTM5ODAsImV4cCI6MTkwMTk3Mzk4MH0.ZNXTWOkbm76MJ6ckT4mo8cyDOwuB_9OgLVu3lNxXHmU",
      amboseli:
        "https://jsxwijazpbcwaystsdgp.supabase.co/storage/v1/object/sign/videos/company-logos/amboseli.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2aWRlb3MvY29tcGFueS1sb2dvcy9hbWJvc2VsaS5qcGciLCJpYXQiOjE3NDQyOTM5MzYsImV4cCI6MTkwMTk3MzkzNn0.ElXtCh3AxadX8Q0VLMf6LmGkYzRy9-zou4eT2iVgfZ4",
      kpa: "https://jsxwijazpbcwaystsdgp.supabase.co/storage/v1/object/sign/videos/company-logos/KPA.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ2aWRlb3MvY29tcGFueS1sb2dvcy9LUEEuanBnIiwiaWF0IjoxNzQ0MjkzOTYyLCJleHAiOjE5MDE5NzM5NjJ9.ylEgzGcW7-zC0DgC1RNkI_AiQDqmCKywzW19HGnwXc4",
    },
  },

  // Contact information
  contact: {
    phone: "+254711111017",
    whatsapp: "https://api.whatsapp.com/send?phone=+254711111017",
    whatsappAlt: "https://api.whatsapp.com/send?phone=+254779403242",
    email: "maishaagrofarmlimited@gmail.com",
    location: "https://maps.google.com/?q=Malili,+Konza,+Rift+Valley,+Kenya",
    website: "https://www.mafllogistics.com",
  },

  // Social media
  social: {
    facebook: "https://www.facebook.com/Mafl2018",
    instagram: "https://www.instagram.com/mafl_logistics_ke_ltd/",
  },
}
