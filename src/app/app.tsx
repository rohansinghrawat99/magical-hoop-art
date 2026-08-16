import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { ArtworkPage } from '@/app/pages/artwork-page';
import { CategoryPage } from '@/app/pages/category-page';
import { HomePage } from '@/app/pages/home-page';
import { ScrollToTop } from '@/app/scroll-to-top';
import { CollectionFilterProvider } from '@/features/collections/collection-filter-provider';
import { EnquiryProvider } from '@/features/enquiry/enquiry-provider';
import { SearchProvider } from '@/features/search/search-provider';

export function App() {
  return (
    <BrowserRouter>
      <EnquiryProvider>
        <SearchProvider>
          <CollectionFilterProvider>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/collections/:categoryId" element={<CategoryPage />} />
              <Route path="/collections/:categoryId/:artworkId" element={<ArtworkPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CollectionFilterProvider>
        </SearchProvider>
      </EnquiryProvider>
    </BrowserRouter>
  );
}
