import React from 'react';

// Genel skeleton bileşeni
export const Skeleton = ({ className = '', children, ...props }) => {
  return (
    <div 
      className={`animate-pulse bg-gray-300/20 rounded ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Kullanıcı bilgileri için skeleton
export const UserInfoSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Başlık skeleton */}
      <Skeleton className="h-8 w-64 mb-8" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sol kolon */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
        
        {/* Sağ kolon */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
      
      {/* Alt bilgiler skeleton */}
      <div className="mt-6 pt-6 border-t border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center space-y-2">
            <Skeleton className="h-4 w-24 mx-auto" />
            <Skeleton className="h-4 w-16 mx-auto" />
          </div>
          <div className="text-center space-y-2">
            <Skeleton className="h-4 w-20 mx-auto" />
            <Skeleton className="h-4 w-20 mx-auto" />
          </div>
          <div className="text-center space-y-2">
            <Skeleton className="h-4 w-24 mx-auto" />
            <Skeleton className="h-4 w-20 mx-auto" />
          </div>
          <div className="text-center space-y-2">
            <Skeleton className="h-4 w-16 mx-auto" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard için skeleton
export const DashboardSkeleton = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Header skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/40 backdrop-blur-lg shadow-lg border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
      
      {/* Ana içerik skeleton */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center p-8 pt-24">
        <UserInfoSkeleton />
      </div>
    </div>
  );
};

// Form skeleton
export const FormSkeleton = () => {
  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20">
      {/* Logo skeleton */}
      <div className="flex justify-center mb-6">
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>
      
      {/* Başlık skeleton */}
      <Skeleton className="h-8 w-48 mx-auto mb-8" />
      
      {/* Form alanları skeleton */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-12 w-full" />
        </div>
        
        {/* Buton skeleton */}
        <Skeleton className="h-12 w-full mt-8" />
        
        {/* Link skeleton */}
        <div className="text-center mt-4">
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    </div>
  );
};

// Sayfa skeleton
export const PageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <FormSkeleton />
    </div>
  );
};

// Liste skeleton
export const ListSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Kart skeleton
export const CardSkeleton = () => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
      <div className="space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex justify-between items-center mt-6">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );
};

