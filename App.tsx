import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPostDetail from './pages/BlogPostDetail';
import Login from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import AdminBlogList from './pages/admin/AdminBlogList';
import AdminBlogEdit from './pages/admin/AdminBlogEdit';
import AdminInquiries from './pages/admin/AdminInquiries';

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPostDetail />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminBlogList />} /> {/* Redirect to blog list by default */}
            <Route path="blog" element={<AdminBlogList />} />
            <Route path="blog/new" element={<AdminBlogEdit />} />
            <Route path="blog/edit/:id" element={<AdminBlogEdit />} />
            <Route path="inquiries" element={<AdminInquiries />} />
          </Route>
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;