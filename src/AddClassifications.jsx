import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddClassifications.css';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:1234';

const AddClassifications = () => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [countries, setCountries] = useState([]);

  const [brandForm, setBrandForm] = useState({ BrandName: '' });
  const [categoryForm, setCategoryForm] = useState({ CategoryName: '' });
  const [subcategoryForm, setSubcategoryForm] = useState({ SubCategoryName: '', CategoryID: '' });
  const [countryProductForm, setCountryProductForm] = useState({ CountryID: '', ProductID: '', Price: '' });

  useEffect(() => {
    fetchBrands();
    fetchCategories();
    fetchSubcategories();
    fetchProducts();
    fetchCountries();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await axios.get('/api/brands');
      setBrands(response.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get('/api/subcategories');
      setSubcategories(response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCountries = async () => {
    try {
      console.log('Fetching countries...');
      const response = await axios.get('/api/countries');
      console.log('Countries fetched successfully:', response.data);
      setCountries(response.data);
    } catch (error) {
      console.error('Error fetching countries:', error.response || error);
      alert('Failed to fetch countries. Please try again later.');
    }
  };

  const handleBrandInputChange = (e) => {
    setBrandForm({ ...brandForm, [e.target.name]: e.target.value });
  };

  const handleCategoryInputChange = (e) => {
    setCategoryForm({ ...categoryForm, [e.target.name]: e.target.value });
  };

  const handleSubcategoryInputChange = (e) => {
    setSubcategoryForm({ ...subcategoryForm, [e.target.name]: e.target.value });
  };

  const handleCountryProductInputChange = (e) => {
    setCountryProductForm({ ...countryProductForm, [e.target.name]: e.target.value });
  };

  const handleBrandSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/brands', brandForm);
      alert('Brand added successfully');
      setBrandForm({ BrandName: '' });
      fetchBrands();
    } catch (error) {
      console.error('Error adding brand:', error);
      alert('Error adding brand. Please try again.');
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/categories', categoryForm);
      alert('Category added successfully');
      setCategoryForm({ CategoryName: '' });
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error adding category. Please try again.');
    }
  };

  const handleSubcategorySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/subcategories', subcategoryForm);
      alert('Subcategory added successfully');
      setSubcategoryForm({ SubCategoryName: '', CategoryID: '' });
      fetchSubcategories();
    } catch (error) {
      console.error('Error adding subcategory:', error);
      alert('Error adding subcategory. Please try again.');
    }
  };

  const handleCountryProductSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/country-products', countryProductForm);
      alert('Country Product added successfully');
      setCountryProductForm({ CountryID: '', ProductID: '', Price: '' });
    } catch (error) {
      console.error('Error adding country product:', error);
      alert('Error adding country product. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1>Add Classifications</h1>
      <div className="forms-container">
        {/* Brand Form */}
        <div className="form-section">
          <h3>Add Brand</h3>
          <form onSubmit={handleBrandSubmit}>
            <div className="form-group">
              <label>Brand Name:</label>
              <input type="text" name="BrandName" value={brandForm.BrandName} onChange={handleBrandInputChange} required />
            </div>
            <button type="submit">Add Brand</button>
          </form>
        </div>

        {/* Category Form */}
        <div className="form-section">
          <h3>Add Category</h3>
          <form onSubmit={handleCategorySubmit}>
            <div className="form-group">
              <label>Category Name:</label>
              <input type="text" name="CategoryName" value={categoryForm.CategoryName} onChange={handleCategoryInputChange} required />
            </div>
            <button type="submit">Add Category</button>
          </form>
        </div>

        {/* Subcategory Form */}
        <div className="form-section">
          <h3>Add Subcategory</h3>
          <form onSubmit={handleSubcategorySubmit}>
            <div className="form-group">
              <label>Subcategory Name:</label>
              <input type="text" name="SubCategoryName" value={subcategoryForm.SubCategoryName} onChange={handleSubcategoryInputChange} required />
            </div>
            <div className="form-group">
              <label>Parent Category:</label>
              <select name="CategoryID" value={subcategoryForm.CategoryID} onChange={handleSubcategoryInputChange} required>
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.CategoryID} value={category.CategoryID}>{category.CategoryName}</option>
                ))}
              </select>
            </div>
            <button type="submit">Add Subcategory</button>
          </form>
        </div>

        {/* Country Product Form */}
        <div className="form-section">
          <h3>Add Country Product</h3>
          <form onSubmit={handleCountryProductSubmit}>
            <div className="form-group">
              <label>Country ID:</label>
              <input 
                type="number" 
                name="CountryID" 
                value={countryProductForm.CountryID} 
                onChange={handleCountryProductInputChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Product ID:</label>
              <select name="ProductID" value={countryProductForm.ProductID} onChange={handleCountryProductInputChange} required>
                <option value="">Select a product</option>
                {products.map(product => (
                  <option key={product.ProductID} value={product.ProductID}>{product.ProductName}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Price:</label>
              <input type="number" name="Price" value={countryProductForm.Price} onChange={handleCountryProductInputChange} required />
            </div>
            <button type="submit">Add Country Product</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddClassifications;