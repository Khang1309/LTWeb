import { useState } from 'react'
import { Route, Routes, createRoutesFromElements, RouterProvider, createBrowserRouter } from 'react-router-dom';

import './App.css'
import MainLayout from './layout/MainLayout';

import Home from './page/Home';
import Products from './page/Products';
import ProductDetails from './page/ProductDetails';
import Contact from './page/Contact';
import AboutUs from './page/AboutUs';
import FAQ from './page/FAQ';

const routes = createRoutesFromElements(

  <>

    <Route path="/" element={<MainLayout />}>

      <Route index element={<Home />} />
      <Route path="products" element={<Products />} />
      <Route path="products/:id" element={<ProductDetails />} />

      <Route path="about" element={<AboutUs />} />
      <Route path="contact" element={<Contact />} />
      <Route path="faq" element={<FAQ />} />

    </Route>



  </>

);

const router = createBrowserRouter(routes)

function App() {


  return <RouterProvider router={router} />;
}

export default App
