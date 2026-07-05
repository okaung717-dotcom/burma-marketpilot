export type Screen = 'signup' | 'step1' | 'step2' | 'analyzing' | 'dashboardOpening' | 'dashboard';

export type ProductDraft = {
  id: string;
  name: string;
  category: string;
  price: string;
  usp: string;
  description: string;
  stock: string;
  tags: string;
  images: Array<{
    file?: File;
    previewUrl: string;
    storagePath?: string;
    publicUrl?: string;
  }>;
};

export type BusinessDraft = {
  logo?: File;
  logoPreviewUrl?: string;
  logoStoragePath?: string;
  logoPublicUrl?: string;
  businessName: string;
  category: string;
  description: string;
  location: string;
  targetAudience: string;
  marketingBudget: string;
  mainGoal: string;
  currentPromotion: string;
  fulfillmentProcess: string;
  customerPainPoint: string;
  brandVoice: string[];
  products: ProductDraft[];
};

export type SetupDraft = {
  connectedPlatforms: string[];
  postingFrequency: string;
  assistance: string[];
};
